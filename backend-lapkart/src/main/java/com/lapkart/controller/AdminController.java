package com.lapkart.controller;

import com.lapkart.entity.Product;
import com.lapkart.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ProductRepository productRepository;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productRepository.save(product));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Product product = productRepository.findById(id).orElseThrow();
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setStockQuantity(productDetails.getStockQuantity());
        product.setCategory(productDetails.getCategory());
        return ResponseEntity.ok(productRepository.save(product));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
