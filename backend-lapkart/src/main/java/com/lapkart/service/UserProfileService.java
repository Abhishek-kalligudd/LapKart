package com.lapkart.service;

import com.lapkart.dto.ChangePasswordRequest;
import com.lapkart.dto.UserAddressDto;
import com.lapkart.dto.UserProfileDto;
import com.lapkart.entity.User;
import com.lapkart.entity.UserAddress;
import com.lapkart.repository.UserAddressRepository;
import com.lapkart.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserRepository userRepository;
    private final UserAddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserProfileDto getProfile(String email) {
        User user = getUserByEmail(email);
        List<UserAddressDto> addresses = addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(user.getId())
                .stream().map(this::toAddressDto).collect(Collectors.toList());

        return UserProfileDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .addresses(addresses)
                .build();
    }

    @Transactional
    public UserProfileDto updateProfile(String email, UserProfileDto req) {
        User user = getUserByEmail(email);

        if (req.getUsername() != null && !req.getUsername().isBlank()) {
            user.setUsername(req.getUsername().trim());
        }
        if (req.getPhone() != null) {
            user.setPhone(req.getPhone().trim());
        }

        userRepository.save(user);
        return getProfile(email);
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest req) {
        User user = getUserByEmail(email);

        if (req.getCurrentPassword() == null || !passwordEncoder.matches(req.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password does not match");
        }

        if (req.getNewPassword() == null || req.getNewPassword().length() < 6) {
            throw new RuntimeException("New password must be at least 6 characters");
        }

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public List<UserAddressDto> getUserAddresses(String email) {
        User user = getUserByEmail(email);
        return addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(user.getId())
                .stream().map(this::toAddressDto).collect(Collectors.toList());
    }

    @Transactional
    public UserAddressDto addAddress(String email, UserAddressDto req) {
        User user = getUserByEmail(email);

        if (req.getFullName() == null || req.getFullName().isBlank() ||
            req.getPhone() == null || req.getPhone().isBlank() ||
            req.getStreetAddress() == null || req.getStreetAddress().isBlank() ||
            req.getCity() == null || req.getCity().isBlank() ||
            req.getState() == null || req.getState().isBlank() ||
            req.getPostalCode() == null || req.getPostalCode().isBlank()) {
            throw new RuntimeException("All address fields are required");
        }

        boolean makeDefault = Boolean.TRUE.equals(req.getIsDefault());
        if (makeDefault) {
            addressRepository.resetDefaultAddressForUser(user.getId());
        }

        UserAddress address = new UserAddress();
        address.setUser(user);
        address.setFullName(req.getFullName().trim());
        address.setPhone(req.getPhone().trim());
        address.setStreetAddress(req.getStreetAddress().trim());
        address.setCity(req.getCity().trim());
        address.setState(req.getState().trim());
        address.setPostalCode(req.getPostalCode().trim());
        address.setIsDefault(makeDefault);

        return toAddressDto(addressRepository.save(address));
    }

    @Transactional
    public void deleteAddress(String email, Long addressId) {
        User user = getUserByEmail(email);
        UserAddress address = addressRepository.findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() -> new RuntimeException("Address not found"));
        addressRepository.delete(address);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    private UserAddressDto toAddressDto(UserAddress a) {
        return UserAddressDto.builder()
                .id(a.getId())
                .fullName(a.getFullName())
                .phone(a.getPhone())
                .streetAddress(a.getStreetAddress())
                .city(a.getCity())
                .state(a.getState())
                .postalCode(a.getPostalCode())
                .isDefault(Boolean.TRUE.equals(a.getIsDefault()))
                .createdAt(a.getCreatedAt())
                .build();
    }
}
