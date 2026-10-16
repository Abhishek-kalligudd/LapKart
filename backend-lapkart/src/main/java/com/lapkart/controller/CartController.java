package com.lapkart.controller;

import com.lapkart.dto.AddToCartRequest;
import com.lapkart.dto.CartResponse;
import com.lapkart.dto.UpdateCartRequest;
import com.lapkart.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponse> getCart(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(cartService.getCart(principal.getName()));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody AddToCartRequest req, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            CartResponse res = cartService.addToCart(principal.getName(), req);
            return ResponseEntity.ok(res);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<?> updateCartItem(@PathVariable Long id, @RequestBody UpdateCartRequest req, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            CartResponse res = cartService.updateCartItem(principal.getName(), id, req);
            return ResponseEntity.ok(res);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<?> removeCartItem(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            CartResponse res = cartService.removeCartItem(principal.getName(), id);
            return ResponseEntity.ok(res);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        cartService.clearCart(principal.getName());
        return ResponseEntity.ok().build();
    }
}
