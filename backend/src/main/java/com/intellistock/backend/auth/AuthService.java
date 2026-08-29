package com.intellistock.backend.auth;

import com.intellistock.backend.auth.dto.*;
import com.intellistock.backend.common.exception.AppException;
import com.intellistock.backend.common.security.JwtUtil;
import com.intellistock.backend.user.Role;
import com.intellistock.backend.user.User;
import com.intellistock.backend.user.UserRepository;
import com.intellistock.backend.warehouse.Warehouse;
import com.intellistock.backend.warehouse.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final OtpRepository otpRepository;
    private final WarehouseRepository warehouseRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (DisabledException e) {
            throw new AppException("Please verify your email before logging in", HttpStatus.FORBIDDEN);
        }
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        log.info("User logged in: {}", user.getEmail());
        return buildResponse(user);
    }

    @Transactional
    public RegisterInitResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException("Email already in use", HttpStatus.CONFLICT);
        }
        Warehouse warehouse = warehouseRepository.save(
                Warehouse.builder().name(request.getWarehouseName()).build()
        );
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .role(Role.ADMIN)
                .warehouse(warehouse)
                .enabled(false)
                .build();
        userRepository.save(user);
        sendOtp(request.getEmail());
        log.info("New workspace '{}' registered by {} (pending verification)",
                warehouse.getName(), request.getEmail());
        return new RegisterInitResponse(request.getEmail());
    }

    @Transactional
    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        OtpToken token = otpRepository.findTopByEmailOrderByCreatedAtDesc(request.getEmail())
                .orElseThrow(() -> new AppException(
                        "No verification code found. Please request a new one.", HttpStatus.BAD_REQUEST));
        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new AppException("Verification code has expired. Please request a new one.", HttpStatus.BAD_REQUEST);
        }
        if (!token.getCode().equals(request.getOtp())) {
            throw new AppException("Invalid verification code.", HttpStatus.BAD_REQUEST);
        }
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        user.setEnabled(true);
        userRepository.save(user);
        otpRepository.deleteAllByEmail(request.getEmail());
        log.info("User verified: {}", user.getEmail());
        return buildResponse(user);
    }

    @Transactional
    public void resendOtp(String email) {
        userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        sendOtp(email);
        log.info("OTP resent to: {}", email);
    }

    private void sendOtp(String email) {
        otpRepository.deleteAllByEmail(email);
        String code = String.format("%06d", new SecureRandom().nextInt(1_000_000));
        otpRepository.save(OtpToken.builder()
                .email(email)
                .code(code)
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .build());
        emailService.sendOtp(email, code);
    }

    private AuthResponse buildResponse(User user) {
        return AuthResponse.builder()
                .token(jwtUtil.generateToken(user))
                .user(AuthResponse.UserInfo.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .name(user.getName())
                        .role(user.getRole().name())
                        .warehouseId(user.getWarehouse() != null ? user.getWarehouse().getId() : null)
                        .warehouseName(user.getWarehouse() != null ? user.getWarehouse().getName() : null)
                        .plan(user.getWarehouse() != null ? user.getWarehouse().getPlan().name() : "FREE")
                        .build())
                .build();
    }
}
