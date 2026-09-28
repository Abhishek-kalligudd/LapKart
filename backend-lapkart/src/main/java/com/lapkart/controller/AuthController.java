package com.lapkart.controller;

import com.lapkart.dto.AuthResponse;
import com.lapkart.entity.User;
import com.lapkart.repository.UserRepository;
import com.lapkart.security.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final com.lapkart.repository.JwtTokenRepository jwtTokenRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        String token = jwtService.generateToken(user.getEmail());

        com.lapkart.entity.JwtToken jwtToken = new com.lapkart.entity.JwtToken();
        jwtToken.setToken(token);
        jwtToken.setUser(user);
        jwtToken.setIsRevoked(false);
        jwtToken.setExpiresAt(new java.util.Date(System.currentTimeMillis() + 7200000));
        jwtTokenRepository.save(jwtToken);

        // Set HttpOnly cookie
        Cookie cookie = new Cookie("jwt", token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(7200); // 2 hours
        response.addCookie(cookie);

        AuthResponse.UserDto userDto = new AuthResponse.UserDto(user.getId(), user.getUsername(), user.getEmail(), user.getRole());
        return ResponseEntity.ok(new AuthResponse(token, userDto));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use");
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("customer");
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @Data
    static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    static class RegisterRequest {
        private String username;
        private String email;
        private String password;
    }
}
