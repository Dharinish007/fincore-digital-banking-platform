package com.fincore.loan.security;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserContext {

    private Long userId;
    private String username;
    private String role;
    private Long customerId;
    private Long employeeId;
    private Set<String> authorities;

    public boolean isCustomer() {
        return "CUSTOMER".equalsIgnoreCase(role);
    }

    public boolean isEmployee() {
        return "EMPLOYEE".equalsIgnoreCase(role);
    }

    public boolean isAdmin() {
        return "ADMIN".equalsIgnoreCase(role);
    }

    public boolean hasPermission(String permission) {
        return authorities != null && authorities.contains(permission);
    }
}
