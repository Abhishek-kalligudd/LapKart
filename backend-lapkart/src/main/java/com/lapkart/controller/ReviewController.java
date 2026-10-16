package com.lapkart.controller;

import com.lapkart.dto.ReviewDto;
import com.lapkart.dto.ReviewRequest;
import com.lapkart.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /** GET /api/public/reviews/product/{productId} — No auth, fetch all reviews for a product */
    @GetMapping("/public/reviews/product/{productId}")
    public ResponseEntity<List<ReviewDto>> getProductReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId));
    }

    /** GET /api/public/reviews/product/{productId}/summary — avg rating + count */
    @GetMapping("/public/reviews/product/{productId}/summary")
    public ResponseEntity<ReviewDto> getProductSummary(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getProductSummary(productId));
    }

    /** POST /api/reviews — Authenticated, submit/update a review */
    @PostMapping("/reviews")
    public ResponseEntity<?> submitReview(@RequestBody ReviewRequest req, Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        try {
            ReviewDto result = reviewService.submitReview(principal.getName(), req);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /** DELETE /api/reviews/{id} — Authenticated, delete own review */
    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id, Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        try {
            reviewService.deleteReview(principal.getName(), id);
            return ResponseEntity.ok("Review deleted");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
