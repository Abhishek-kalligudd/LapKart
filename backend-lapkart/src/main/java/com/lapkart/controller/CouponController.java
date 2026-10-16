package com.lapkart.controller;

import com.lapkart.dto.ApplyCouponRequest;
import com.lapkart.dto.CouponResponse;
import com.lapkart.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    @GetMapping
    public ResponseEntity<List<CouponResponse>> getActiveCoupons() {
        return ResponseEntity.ok(couponService.getActiveCoupons());
    }

    @PostMapping("/apply")
    public ResponseEntity<CouponResponse> applyCoupon(@RequestBody ApplyCouponRequest req) {
        CouponResponse res = couponService.applyCoupon(req);
        return ResponseEntity.ok(res);
    }
}
