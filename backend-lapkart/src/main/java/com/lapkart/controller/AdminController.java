package com.lapkart.controller;

import com.lapkart.dto.CategoryRequest;
import com.lapkart.dto.ProductRequest;
import com.lapkart.entity.Category;
import com.lapkart.entity.Product;
import com.lapkart.entity.ProductImg;
import com.lapkart.entity.User;
import com.lapkart.repository.CategoryRepository;
import com.lapkart.repository.ProductImgRepository;
import com.lapkart.repository.ProductRepository;
import com.lapkart.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.RoundingMode;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImgRepository productImgRepository;
    private final UserRepository userRepository;
    private final com.lapkart.service.OrderService orderService;
    private final com.lapkart.repository.OrderRepository orderRepository;
    private final com.lapkart.service.ContactService contactService;

    // ==========================================
    // PRODUCTS MANAGEMENT
    // ==========================================

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/products")
    @Transactional
    public ResponseEntity<Product> createProduct(@RequestBody ProductRequest req) {
        Product product = new Product();
        product.setBrand(req.getBrand());
        product.setName(req.getName());
        product.setSku(req.getSku() != null && !req.getSku().isBlank() 
                ? req.getSku() 
                : "LPK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        product.setDescription(req.getDescription() != null ? req.getDescription() : "");
        product.setPrice(req.getPrice() != null ? req.getPrice().setScale(0, RoundingMode.HALF_UP) : null);
        product.setDiscountPrice(req.getDiscountPrice() != null ? req.getDiscountPrice().setScale(0, RoundingMode.HALF_UP) : null);
        product.setStockQuantity(req.getStockQuantity() != null ? req.getStockQuantity() : 0);
        product.setProcessor(req.getProcessor());
        product.setRamGb(req.getRamGb());
        product.setStorage(req.getStorage());
        product.setDisplaySpecs(req.getDisplaySpecs());
        product.setGpu(req.getGpu());
        product.setOs(req.getOs());
        product.setIsActive(req.getIsActive() != null ? req.getIsActive() : true);

        if (req.getCategoryId() != null) {
            categoryRepository.findById(req.getCategoryId()).ifPresent(product::setCategory);
        }

        Product savedProduct = productRepository.save(product);

        // Add images if provided
        if (req.getImages() != null && !req.getImages().isEmpty()) {
            List<ProductImg> imgs = new ArrayList<>();
            for (int i = 0; i < req.getImages().size(); i++) {
                ProductRequest.ImageDto imgDto = req.getImages().get(i);
                if (imgDto.getImageUrl() != null && !imgDto.getImageUrl().isBlank()) {
                    ProductImg img = new ProductImg();
                    img.setProduct(savedProduct);
                    img.setImageUrl(imgDto.getImageUrl());
                    img.setAltText(imgDto.getAltText() != null ? imgDto.getAltText() : savedProduct.getName());
                    img.setIsPrimary(imgDto.getIsPrimary() != null ? imgDto.getIsPrimary() : (i == 0));
                    imgs.add(productImgRepository.save(img));
                }
            }
            savedProduct.setProductImgs(imgs);
        }

        return ResponseEntity.ok(savedProduct);
    }

    @PutMapping("/products/{id}")
    @Transactional
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody ProductRequest req) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));

        product.setBrand(req.getBrand());
        product.setName(req.getName());
        if (req.getSku() != null && !req.getSku().isBlank()) {
            product.setSku(req.getSku());
        }
        product.setDescription(req.getDescription());
        product.setPrice(req.getPrice() != null ? req.getPrice().setScale(0, RoundingMode.HALF_UP) : null);
        product.setDiscountPrice(req.getDiscountPrice() != null ? req.getDiscountPrice().setScale(0, RoundingMode.HALF_UP) : null);
        product.setStockQuantity(req.getStockQuantity());
        product.setProcessor(req.getProcessor());
        product.setRamGb(req.getRamGb());
        product.setStorage(req.getStorage());
        product.setDisplaySpecs(req.getDisplaySpecs());
        product.setGpu(req.getGpu());
        product.setOs(req.getOs());
        if (req.getIsActive() != null) {
            product.setIsActive(req.getIsActive());
        }

        if (req.getCategoryId() != null) {
            Category cat = categoryRepository.findById(req.getCategoryId()).orElse(null);
            product.setCategory(cat);
        } else {
            product.setCategory(null);
        }

        Product updated = productRepository.save(product);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // ==========================================
    // PRODUCT IMAGES MANAGEMENT
    // ==========================================

    @GetMapping("/products/{id}/images")
    public ResponseEntity<List<ProductImg>> getProductImages(@PathVariable Long id) {
        return ResponseEntity.ok(productImgRepository.findByProductId(id));
    }

    @PostMapping("/products/{id}/images")
    @Transactional
    public ResponseEntity<ProductImg> addProductImage(@PathVariable Long id, @RequestBody ProductRequest.ImageDto imgDto) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        
        // If this image is designated primary, unset other primaries
        if (Boolean.TRUE.equals(imgDto.getIsPrimary())) {
            List<ProductImg> existingImgs = productImgRepository.findByProductId(id);
            for (ProductImg img : existingImgs) {
                if (Boolean.TRUE.equals(img.getIsPrimary())) {
                    img.setIsPrimary(false);
                    productImgRepository.save(img);
                }
            }
        }

        ProductImg img = new ProductImg();
        img.setProduct(product);
        img.setImageUrl(imgDto.getImageUrl());
        img.setAltText(imgDto.getAltText() != null ? imgDto.getAltText() : product.getName());
        img.setIsPrimary(imgDto.getIsPrimary() != null ? imgDto.getIsPrimary() : false);

        return ResponseEntity.ok(productImgRepository.save(img));
    }

    @PutMapping("/products/{productId}/images/{imgId}/primary")
    @Transactional
    public ResponseEntity<?> setPrimaryImage(@PathVariable Long productId, @PathVariable Long imgId) {
        List<ProductImg> existingImgs = productImgRepository.findByProductId(productId);
        for (ProductImg img : existingImgs) {
            img.setIsPrimary(img.getId().equals(imgId));
            productImgRepository.save(img);
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/products/{productId}/images/{imgId}")
    public ResponseEntity<?> deleteProductImage(@PathVariable Long productId, @PathVariable Long imgId) {
        productImgRepository.deleteById(imgId);
        return ResponseEntity.ok().build();
    }

    // ==========================================
    // CATEGORIES MANAGEMENT
    // ==========================================

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@RequestBody CategoryRequest req) {
        Category category = new Category();
        category.setName(req.getName());
        
        String slug = req.getSlug();
        if (slug == null || slug.isBlank()) {
            slug = req.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        }
        category.setSlug(slug);
        category.setDescription(req.getDescription());

        return ResponseEntity.ok(categoryRepository.save(category));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody CategoryRequest req) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
        category.setName(req.getName());
        if (req.getSlug() != null && !req.getSlug().isBlank()) {
            category.setSlug(req.getSlug());
        }
        category.setDescription(req.getDescription());
        return ResponseEntity.ok(categoryRepository.save(category));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        categoryRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // ==========================================
    // USERS MANAGEMENT
    // ==========================================

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // ==========================================
    // ORDERS MANAGEMENT
    // ==========================================

    @GetMapping("/orders")
    public ResponseEntity<List<com.lapkart.dto.OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrdersForAdmin());
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody com.lapkart.dto.UpdateOrderStatusRequest req) {
        try {
            return ResponseEntity.ok(orderService.updateOrderStatus(id, req));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ==========================================
    // ADMIN DASHBOARD STATS
    // ==========================================

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        long totalProducts = productRepository.count();
        long totalCategories = categoryRepository.count();
        long totalUsers = userRepository.count();
        long totalOrders = orderRepository.count();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", totalProducts);
        stats.put("totalCategories", totalCategories);
        stats.put("totalUsers", totalUsers);
        stats.put("totalOrders", totalOrders);
        return ResponseEntity.ok(stats);
    }

    // ==========================================
    // CONTACT INQUIRIES
    // ==========================================

    @GetMapping("/contact-inquiries")
    public ResponseEntity<List<com.lapkart.entity.ContactInquiry>> getContactInquiries() {
        return ResponseEntity.ok(contactService.getAllInquiries());
    }

    @PutMapping("/contact-inquiries/{id}/read")
    public ResponseEntity<?> markInquiryRead(@PathVariable Long id) {
        contactService.markAsRead(id);
        return ResponseEntity.ok(Map.of("message", "Marked as read"));
    }
}
