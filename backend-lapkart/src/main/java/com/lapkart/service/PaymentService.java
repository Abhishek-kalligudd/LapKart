package com.lapkart.service;

import com.lapkart.dto.PaymentVerificationRequest;
import com.lapkart.dto.RazorpayOrderResponse;
import com.lapkart.entity.Order;
import com.lapkart.repository.OrderRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final OrderRepository orderRepository;

    @Value("${razorpay.key-id}")
    private String razorpayKeyId;

    @Value("${razorpay.key-secret}")
    private String razorpayKeySecret;

    /**
     * Step 1 — Called by /api/payments/create-order
     * Creates a Razorpay order for the given LapKart order and stores the razorpayOrderId.
     */
    @Transactional
    public RazorpayOrderResponse createRazorpayOrder(String userEmail, Long lapkartOrderId) {
        Order order = orderRepository.findById(lapkartOrderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + lapkartOrderId));

        // Security: ensure the authenticated user owns this order
        if (!order.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new RuntimeException("Unauthorized access to order");
        }

        // Already has a razorpay order id? Return it (idempotent)
        if (order.getRazorpayOrderId() != null && !order.getRazorpayOrderId().isEmpty()) {
            return buildResponse(order);
        }

        try {
            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            // Razorpay expects amount in PAISE (₹1 = 100 paise)
            long amountInPaise = order.getTotalAmount()
                    .multiply(BigDecimal.valueOf(100))
                    .longValue();

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", order.getOrderNumber());

            com.razorpay.Order razorpayOrder = client.orders.create(orderRequest);
            String rzpOrderId = razorpayOrder.get("id");

            order.setRazorpayOrderId(rzpOrderId);
            order.setPaymentStatus("Pending");
            orderRepository.save(order);

            return buildResponse(order);

        } catch (RazorpayException e) {
            throw new RuntimeException("Failed to create Razorpay order: " + e.getMessage());
        }
    }

    /**
     * Step 2 — Called by /api/payments/verify
     * Verifies the HMAC-SHA256 signature from Razorpay and marks the order as Paid.
     */
    @Transactional
    public boolean verifyAndConfirmPayment(String userEmail, PaymentVerificationRequest req) {
        Order order = orderRepository.findById(req.getLapkartOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found: " + req.getLapkartOrderId()));

        if (!order.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new RuntimeException("Unauthorized access to order");
        }

        // Verify HMAC-SHA256 signature
        String payload = req.getRazorpayOrderId() + "|" + req.getRazorpayPaymentId();
        boolean isValid = verifySignature(payload, req.getRazorpaySignature(), razorpayKeySecret);

        if (isValid) {
            order.setRazorpayPaymentId(req.getRazorpayPaymentId());
            order.setPaymentStatus("Paid");
            order.setOrderStatus("Processing");
            orderRepository.save(order);
            return true;
        } else {
            order.setPaymentStatus("Failed");
            orderRepository.save(order);
            throw new RuntimeException("Payment signature verification failed. Possible tampering detected.");
        }
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private RazorpayOrderResponse buildResponse(Order order) {
        long amountInPaise = order.getTotalAmount()
                .multiply(BigDecimal.valueOf(100))
                .longValue();
        return RazorpayOrderResponse.builder()
                .razorpayOrderId(order.getRazorpayOrderId())
                .amount(amountInPaise)
                .currency("INR")
                .lapkartOrderNumber(order.getOrderNumber())
                .lapkartOrderId(order.getId())
                .build();
    }

    private boolean verifySignature(String payload, String signature, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(
                    secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String computed = HexFormat.of().formatHex(hash);
            return computed.equalsIgnoreCase(signature);
        } catch (Exception e) {
            return false;
        }
    }
}
