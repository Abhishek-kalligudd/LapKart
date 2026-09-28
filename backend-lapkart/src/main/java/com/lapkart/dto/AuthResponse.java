package com.lapkart.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private UserDto user;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserDto {
        private Long id;
        private String username;
        private String email;
        private String role;
    }
}
