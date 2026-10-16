package com.lapkart.service;

import com.lapkart.entity.Product;
import com.lapkart.entity.User;
import com.lapkart.entity.WishlistItem;
import com.lapkart.repository.ProductRepository;
import com.lapkart.repository.UserRepository;
import com.lapkart.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<Product> getUserWishlist(String userEmail) {
        User user = getUserByEmail(userEmail);
        return wishlistRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(WishlistItem::getProduct)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Long> getUserWishlistProductIds(String userEmail) {
        User user = getUserByEmail(userEmail);
        return wishlistRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(w -> w.getProduct().getId())
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean toggleWishlist(String userEmail, Long productId) {
        User user = getUserByEmail(userEmail);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (wishlistRepository.existsByUserIdAndProductId(user.getId(), product.getId())) {
            wishlistRepository.deleteByUserIdAndProductId(user.getId(), product.getId());
            return false; // Removed
        } else {
            WishlistItem item = new WishlistItem();
            item.setUser(user);
            item.setProduct(product);
            wishlistRepository.save(item);
            return true; // Added
        }
    }

    @Transactional
    public void removeFromWishlist(String userEmail, Long productId) {
        User user = getUserByEmail(userEmail);
        wishlistRepository.deleteByUserIdAndProductId(user.getId(), productId);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }
}
