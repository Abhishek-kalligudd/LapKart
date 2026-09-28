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
    public CommandLineRunner initAdminUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
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
