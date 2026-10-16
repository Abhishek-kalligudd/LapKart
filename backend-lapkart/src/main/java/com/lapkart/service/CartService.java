package com.lapkart.service;

import com.lapkart.dto.AddToCartRequest;
import com.lapkart.dto.CartItemDto;
import com.lapkart.dto.CartResponse;
import com.lapkart.dto.UpdateCartRequest;
import com.lapkart.entity.CartItem;
import com.lapkart.entity.Product;
import com.lapkart.entity.ProductImg;
import com.lapkart.entity.User;
import com.lapkart.repository.CartItemRepository;
import com.lapkart.repository.ProductRepository;
import com.lapkart.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public CartResponse getCart(String userEmail) {
        User user = getUserByEmail(userEmail);
        List<CartItem> items = cartItemRepository.findByUserId(user.getId());
        return mapToCartResponse(items);
    }

    @Transactional
    public CartResponse addToCart(String userEmail, AddToCartRequest req) {
        User user = getUserByEmail(userEmail);
        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + req.getProductId()));

        if (Boolean.FALSE.equals(product.getIsActive())) {
            throw new RuntimeException("Product is currently unavailable");
        }

        int addQuantity = (req.getQuantity() != null && req.getQuantity() > 0) ? req.getQuantity() : 1;
        int availableStock = (product.getStockQuantity() != null) ? product.getStockQuantity() : 0;

        Optional<CartItem> existingOpt = cartItemRepository.findByUserIdAndProductId(user.getId(), product.getId());

        if (existingOpt.isPresent()) {
            CartItem existing = existingOpt.get();
            int newQuantity = existing.getQuantity() + addQuantity;
            if (newQuantity > availableStock) {
                throw new RuntimeException("Cannot add more items. Available stock: " + availableStock);
            }
            existing.setQuantity(newQuantity);
            cartItemRepository.save(existing);
        } else {
            if (addQuantity > availableStock) {
                throw new RuntimeException("Requested quantity exceeds available stock (" + availableStock + ")");
            }
            CartItem newItem = new CartItem();
            newItem.setUser(user);
            newItem.setProduct(product);
            newItem.setQuantity(addQuantity);
            cartItemRepository.save(newItem);
        }

        return getCart(userEmail);
    }

    @Transactional
    public CartResponse updateCartItem(String userEmail, Long cartItemId, UpdateCartRequest req) {
        User user = getUserByEmail(userEmail);
        CartItem cartItem = cartItemRepository.findByIdAndUserId(cartItemId, user.getId())
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        int newQuantity = (req.getQuantity() != null) ? req.getQuantity() : 0;

        if (newQuantity <= 0) {
            cartItemRepository.delete(cartItem);
        } else {
            Product product = cartItem.getProduct();
            int availableStock = (product.getStockQuantity() != null) ? product.getStockQuantity() : 0;
            if (newQuantity > availableStock) {
                throw new RuntimeException("Quantity exceeds available stock (" + availableStock + ")");
            }
            cartItem.setQuantity(newQuantity);
            cartItemRepository.save(cartItem);
        }

        return getCart(userEmail);
    }

    @Transactional
    public CartResponse removeCartItem(String userEmail, Long cartItemId) {
        User user = getUserByEmail(userEmail);
        CartItem cartItem = cartItemRepository.findByIdAndUserId(cartItemId, user.getId())
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        cartItemRepository.delete(cartItem);
        return getCart(userEmail);
    }

    @Transactional
    public void clearCart(String userEmail) {
        User user = getUserByEmail(userEmail);
        cartItemRepository.deleteByUserId(user.getId());
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    private CartResponse mapToCartResponse(List<CartItem> items) {
        List<CartItemDto> dtos = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        int totalItems = 0;

        for (CartItem item : items) {
            Product product = item.getProduct();
            BigDecimal effectivePrice = (product.getDiscountPrice() != null && product.getDiscountPrice().compareTo(BigDecimal.ZERO) > 0)
                    ? product.getDiscountPrice()
                    : product.getPrice();

            BigDecimal subtotal = effectivePrice.multiply(BigDecimal.valueOf(item.getQuantity()));
            totalAmount = totalAmount.add(subtotal);
            totalItems += item.getQuantity();

            String primaryImage = null;
            if (product.getProductImgs() != null && !product.getProductImgs().isEmpty()) {
                primaryImage = product.getProductImgs().stream()
                        .filter(img -> Boolean.TRUE.equals(img.getIsPrimary()))
                        .findFirst()
                        .map(ProductImg::getImageUrl)
                        .orElse(product.getProductImgs().get(0).getImageUrl());
            }

            CartItemDto dto = CartItemDto.builder()
                    .id(item.getId())
                    .productId(product.getId())
                    .name(product.getName())
                    .brand(product.getBrand())
                    .sku(product.getSku())
                    .price(product.getPrice())
                    .discountPrice(product.getDiscountPrice())
                    .effectivePrice(effectivePrice)
                    .quantity(item.getQuantity())
                    .stockQuantity(product.getStockQuantity() != null ? product.getStockQuantity() : 0)
                    .imageUrl(primaryImage)
                    .subtotal(subtotal)
                    .build();

            dtos.add(dto);
        }

        return CartResponse.builder()
                .items(dtos)
                .totalItems(totalItems)
                .totalAmount(totalAmount)
                .build();
    }
}
