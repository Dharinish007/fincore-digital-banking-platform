package com.fincore.customerservice.dto;

import com.fincore.customerservice.entity.User;
import com.fincore.customerservice.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String username;
    private String fullName;
    private String email;
    private Role role;
    private Long customerId;
    private Long employeeId;
    private Set<String> permissions;

    public static UserResponse from(User user) {
        if (user == null) return null;
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .customerId(user.getCustomerId())
                .employeeId(user.getEmployeeId())
                .permissions(user.getRole() != null ? user.getRole().getPermissions() : Set.of())
                .build();
    }
}
