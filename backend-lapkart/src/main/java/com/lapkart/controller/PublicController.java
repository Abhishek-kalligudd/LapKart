package com.lapkart.controller;

import com.lapkart.entity.Product;
import com.lapkart.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final ProductRepository productRepository;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }
}
