package com.lapkart.config;

import com.lapkart.entity.User;
import com.lapkart.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initAdminUser(UserRepository userRepository, PasswordEncoder passwordEncoder, org.springframework.jdbc.core.JdbcTemplate jdbcTemplate) {
        return args -> {
            // Deduplicate product images that were multiplied by previous restarts
            try {
                int deleted = jdbcTemplate.update(
                    "DELETE p1 FROM product_imgs p1 " +
                    "INNER JOIN product_imgs p2 " +
                    "WHERE p1.img_id > p2.img_id " +
                    "  AND p1.product_id = p2.product_id " +
                    "  AND p1.image_url = p2.image_url"
                );
                if (deleted > 0) {
                    System.out.println("✅ Cleaned up " + deleted + " duplicate product images!");
                }
            } catch (Exception e) {
                System.err.println("Note on image deduplication: " + e.getMessage());
            }

            if (userRepository.findByEmail("admin@lapkart.com").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@lapkart.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("admin");
                userRepository.save(admin);
                System.out.println("✅ Admin user created: admin@lapkart.com / admin123");
            }
        };
    }
}
