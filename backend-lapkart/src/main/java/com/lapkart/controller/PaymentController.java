package com.lapkart.controller;

import com.lapkart.dto.PaymentVerificationRequest;
import com.lapkart.dto.RazorpayOrderResponse;
import com.lapkart.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @Value("${razorpay.key-id}")
    private String razorpayKeyId;

    /**
     * POST /api/payments/create-order
     * Body: { "lapkartOrderId": 123 }
     * Creates a Razorpay order for an existing LapKart order and returns the
     * details needed to open the Razorpay checkout popup on the frontend.
     */
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(
            @RequestBody Map<String, Long> body,
            Principal principal) {

        if (principal == null) return ResponseEntity.status(401).build();

        Long lapkartOrderId = body.get("lapkartOrderId");
        if (lapkartOrderId == null) {
            return ResponseEntity.badRequest().body("lapkartOrderId is required");
        }

        try {
            RazorpayOrderResponse response = paymentService
                    .createRazorpayOrder(principal.getName(), lapkartOrderId);
            // Also expose the key-id so the frontend never hard-codes it
            return ResponseEntity.ok(Map.of(
                    "razorpayOrderId",    response.getRazorpayOrderId(),
                    "amount",             response.getAmount(),
                    "currency",           response.getCurrency(),
                    "lapkartOrderNumber", response.getLapkartOrderNumber(),
                    "lapkartOrderId",     response.getLapkartOrderId(),
                    "keyId",              razorpayKeyId
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * POST /api/payments/verify
     * Body: { razorpayOrderId, razorpayPaymentId, razorpaySignature, lapkartOrderId }
     * Verifies the HMAC signature from Razorpay and marks the order as Paid.
     */
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
            @RequestBody PaymentVerificationRequest req,
            Principal principal) {

        if (principal == null) return ResponseEntity.status(401).build();

        try {
            boolean success = paymentService.verifyAndConfirmPayment(principal.getName(), req);
            if (success) {
                return ResponseEntity.ok(Map.of("status", "Payment verified successfully"));
            } else {
                return ResponseEntity.status(400).body("Payment verification failed");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
