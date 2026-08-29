package com.intellistock.backend.user;

import com.intellistock.backend.common.exception.AppException;
import com.intellistock.backend.common.tenant.TenantContext;
import com.intellistock.backend.user.dto.CreateUserRequest;
import com.intellistock.backend.user.dto.UpdateRoleRequest;
import com.intellistock.backend.user.dto.UserResponse;
import com.intellistock.backend.warehouse.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final WarehouseRepository warehouseRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<UserResponse> listUsers() {
        Long wid = TenantContext.get();
        return userRepository.findByWarehouseIdOrderByCreatedAtDesc(wid)
                .stream().map(UserResponse::from).toList();
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        Long wid = TenantContext.get();
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException("Email already in use", HttpStatus.CONFLICT);
        }
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .warehouse(warehouseRepository.getReferenceById(wid))
                .enabled(true)
                .build();
        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public UserResponse updateRole(Long userId, UpdateRoleRequest request) {
        Long wid = TenantContext.get();
        User user = userRepository.findByIdAndWarehouseId(userId, wid)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        user.setRole(request.getRole());
        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long userId) {
        Long wid = TenantContext.get();
        User user = userRepository.findByIdAndWarehouseId(userId, wid)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        userRepository.delete(user);
    }
}
