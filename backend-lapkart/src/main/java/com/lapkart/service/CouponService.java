package com.lapkart.service;

import com.lapkart.dto.ApplyCouponRequest;
import com.lapkart.dto.CouponResponse;
import com.lapkart.entity.Coupon;
import com.lapkart.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    @Transactional(readOnly = true)
    public List<CouponResponse> getActiveCoupons() {
        return couponRepository.findByIsActiveTrue().stream()
                .map(c -> CouponResponse.builder()
                        .valid(true)
                        .code(c.getCode())
                        .discountPercent(c.getDiscountPercent())
                        .discountAmount(BigDecimal.ZERO)
                        .finalAmount(BigDecimal.ZERO)
                        .description(c.getDescription())
                        .message("Available")
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CouponResponse applyCoupon(ApplyCouponRequest req) {
        if (req.getCode() == null || req.getCode().trim().isEmpty()) {
            return CouponResponse.builder()
                    .valid(false)
                    .message("Please enter a coupon code")
                    .build();
        }

        BigDecimal amount = req.getOrderAmount() != null ? req.getOrderAmount() : BigDecimal.ZERO;
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            return CouponResponse.builder()
                    .valid(false)
                    .message("Cart amount must be greater than zero to apply coupon")
                    .build();
        }

        Coupon coupon = couponRepository.findByCodeIgnoreCaseAndIsActiveTrue(req.getCode().trim())
                .orElse(null);

        if (coupon == null) {
            return CouponResponse.builder()
                    .valid(false)
                    .code(req.getCode().trim().toUpperCase())
                    .message("Invalid or expired coupon code")
                    .build();
        }

        if (coupon.getMinOrderAmount() != null && amount.compareTo(coupon.getMinOrderAmount()) < 0) {
            return CouponResponse.builder()
                    .valid(false)
                    .code(coupon.getCode())
                    .message("Coupon requires a minimum order of ₹" + coupon.getMinOrderAmount())
                    .build();
        }

        BigDecimal percent = BigDecimal.valueOf(coupon.getDiscountPercent()).divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
        BigDecimal discount = amount.multiply(percent).setScale(2, RoundingMode.HALF_UP);

        if (coupon.getMaxDiscount() != null && discount.compareTo(coupon.getMaxDiscount()) > 0) {
            discount = coupon.getMaxDiscount();
        }

        BigDecimal finalAmount = amount.subtract(discount);
        if (finalAmount.compareTo(BigDecimal.ZERO) < 0) {
            finalAmount = BigDecimal.ZERO;
        }

        return CouponResponse.builder()
                .valid(true)
                .code(coupon.getCode())
                .discountPercent(coupon.getDiscountPercent())
                .discountAmount(discount)
                .finalAmount(finalAmount)
                .description(coupon.getDescription())
                .message("Coupon applied successfully! You saved ₹" + discount)
                .build();
    }
}
