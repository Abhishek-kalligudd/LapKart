package com.lapkart.service;

import com.lapkart.dto.CreateOrderRequest;
import com.lapkart.dto.OrderItemDto;
import com.lapkart.dto.OrderResponse;
import com.lapkart.dto.UpdateOrderStatusRequest;
import com.lapkart.entity.*;
import com.lapkart.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public OrderResponse createOrder(String userEmail, CreateOrderRequest req) {
        User user = getUserByEmail(userEmail);

        if (req.getShippingAddress() == null || req.getShippingAddress().trim().isEmpty()) {
            throw new RuntimeException("Shipping address is required");
        }

        List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cannot place order. Your cart is empty");
        }

        // Validate stock and active status for each item
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            if (Boolean.FALSE.equals(product.getIsActive())) {
                throw new RuntimeException("Product " + product.getName() + " is currently unavailable");
            }

            int availableStock = (product.getStockQuantity() != null) ? product.getStockQuantity() : 0;
            if (cartItem.getQuantity() > availableStock) {
                throw new RuntimeException("Insufficient stock for " + product.getName() + ". Available: " + availableStock);
            }

            BigDecimal effectivePrice = (product.getDiscountPrice() != null && product.getDiscountPrice().compareTo(BigDecimal.ZERO) > 0)
                    ? product.getDiscountPrice()
                    : product.getPrice();
            if (effectivePrice != null) {
                effectivePrice = effectivePrice.setScale(0, RoundingMode.HALF_UP);
            }

            totalAmount = totalAmount.add(effectivePrice.multiply(BigDecimal.valueOf(cartItem.getQuantity()))).setScale(0, RoundingMode.HALF_UP);
        }

        // Generate unique order number
        String orderNumber = "LPK-" + System.currentTimeMillis() + "-" + (int)(Math.random() * 9000 + 1000);

        Order order = new Order();
        order.setUser(user);
        order.setOrderNumber(orderNumber);
        order.setTotalAmount(totalAmount);
        order.setOrderStatus("Processing");
        order.setPaymentStatus("Pending");
        order.setShippingAddress(req.getShippingAddress().trim());

        Order savedOrder = orderRepository.save(order);

        List<OrderItem> savedOrderItems = new ArrayList<>();
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            BigDecimal effectivePrice = (product.getDiscountPrice() != null && product.getDiscountPrice().compareTo(BigDecimal.ZERO) > 0)
                    ? product.getDiscountPrice()
                    : product.getPrice();
            if (effectivePrice != null) {
                effectivePrice = effectivePrice.setScale(0, RoundingMode.HALF_UP);
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPriceLocked(effectivePrice);
            savedOrderItems.add(orderItemRepository.save(orderItem));

            // Decrement inventory stock
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);
        }

        savedOrder.setOrderItems(savedOrderItems);

        // Clear cart after successful order creation
        cartItemRepository.deleteByUserId(user.getId());

        return mapToOrderResponse(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getUserOrders(String userEmail) {
        User user = getUserByEmail(userEmail);
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return orders.stream().map(this::mapToOrderResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(String userEmail, Long orderId) {
        User user = getUserByEmail(userEmail);
        Order order = orderRepository.findByIdAndUserId(orderId, user.getId())
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        return mapToOrderResponse(order);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderByOrderNumber(String userEmail, String orderNumber) {
        User user = getUserByEmail(userEmail);
        Order order = orderRepository.findByOrderNumberAndUserId(orderNumber, user.getId())
                .orElseThrow(() -> new RuntimeException("Order not found with order number: " + orderNumber));
        return mapToOrderResponse(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrdersForAdmin() {
        List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();
        return orders.stream().map(this::mapToOrderResponse).collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest req) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        String oldStatus = order.getOrderStatus();
        String newStatus = req.getOrderStatus();

        if (newStatus != null && !newStatus.isBlank()) {
            // If changing to Cancelled from another status, restock inventory
            if ("Cancelled".equalsIgnoreCase(newStatus) && !"Cancelled".equalsIgnoreCase(oldStatus)) {
                if (order.getOrderItems() != null) {
                    for (OrderItem item : order.getOrderItems()) {
                        Product product = item.getProduct();
                        int currentStock = (product.getStockQuantity() != null) ? product.getStockQuantity() : 0;
                        product.setStockQuantity(currentStock + item.getQuantity());
                        productRepository.save(product);
                    }
                }
                if (order.getPaymentStatus() != null && "Paid".equalsIgnoreCase(order.getPaymentStatus())) {
                    order.setPaymentStatus("Refunded");
                }
            }
            order.setOrderStatus(newStatus);
        }

        if (req.getPaymentStatus() != null && !req.getPaymentStatus().isBlank()) {
            order.setPaymentStatus(req.getPaymentStatus());
        }

        if (req.getCourierName() != null) {
            order.setCourierName(req.getCourierName().trim());
        }

        if (req.getTrackingNumber() != null) {
            order.setTrackingNumber(req.getTrackingNumber().trim());
        }

        Order updated = orderRepository.save(order);
        return mapToOrderResponse(updated);
    }

    @Transactional
    public OrderResponse cancelOrder(String userEmail, Long orderId) {
        User user = getUserByEmail(userEmail);
        Order order = orderRepository.findByIdAndUserId(orderId, user.getId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        String status = order.getOrderStatus();
        if (!"Pending".equalsIgnoreCase(status) && !"Processing".equalsIgnoreCase(status)) {
            throw new RuntimeException("Order cannot be cancelled. Current status: " + status);
        }

        // Restock inventory for each item
        if (order.getOrderItems() != null) {
            for (com.lapkart.entity.OrderItem item : order.getOrderItems()) {
                com.lapkart.entity.Product product = item.getProduct();
                int currentStock = (product.getStockQuantity() != null) ? product.getStockQuantity() : 0;
                product.setStockQuantity(currentStock + item.getQuantity());
                productRepository.save(product);
            }
        }

        order.setOrderStatus("Cancelled");
        order.setPaymentStatus("Refunded");
        Order saved = orderRepository.save(order);
        return mapToOrderResponse(saved);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    private OrderResponse mapToOrderResponse(Order order) {
        List<OrderItemDto> itemDtos = new ArrayList<>();
        if (order.getOrderItems() != null) {
            for (OrderItem oi : order.getOrderItems()) {
                Product product = oi.getProduct();
                String imageUrl = null;
                if (product.getProductImgs() != null && !product.getProductImgs().isEmpty()) {
                    imageUrl = product.getProductImgs().stream()
                            .filter(img -> Boolean.TRUE.equals(img.getIsPrimary()))
                            .findFirst()
                            .map(ProductImg::getImageUrl)
                            .orElse(product.getProductImgs().get(0).getImageUrl());
                }

                BigDecimal subtotal = oi.getPriceLocked() != null
                        ? oi.getPriceLocked().multiply(BigDecimal.valueOf(oi.getQuantity())).setScale(0, RoundingMode.HALF_UP)
                        : BigDecimal.ZERO;

                itemDtos.add(OrderItemDto.builder()
                        .id(oi.getId())
                        .productId(product.getId())
                        .name(product.getName())
                        .brand(product.getBrand())
                        .sku(product.getSku())
                        .imageUrl(imageUrl)
                        .quantity(oi.getQuantity())
                        .priceLocked(oi.getPriceLocked())
                        .subtotal(subtotal)
                        .build());
            }
        }

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .totalAmount(order.getTotalAmount())
                .orderStatus(order.getOrderStatus())
                .paymentStatus(order.getPaymentStatus())
                .shippingAddress(order.getShippingAddress())
                .razorpayOrderId(order.getRazorpayOrderId())
                .razorpayPaymentId(order.getRazorpayPaymentId())
                .courierName(order.getCourierName())
                .trackingNumber(order.getTrackingNumber())
                .createdAt(order.getCreatedAt())
                .items(itemDtos)
                .userId(order.getUser() != null ? order.getUser().getId() : null)
                .customerName(order.getUser() != null ? order.getUser().getUsername() : null)
                .customerEmail(order.getUser() != null ? order.getUser().getEmail() : null)
                .build();
    }
}
