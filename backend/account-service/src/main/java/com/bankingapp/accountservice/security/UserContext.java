package com.bankingapp.accountservice.security;

import java.util.Set;

public class UserContext {

    private Long userId;
    private String username;
    private String role;
    private Long customerId;
    private Long employeeId;
    private Set<String> authorities;

    public UserContext() {
    }

    public UserContext(Long userId, String username, String role, Long customerId, Long employeeId, Set<String> authorities) {
        this.userId = userId;
        this.username = username;
        this.role = role;
        this.customerId = customerId;
        this.employeeId = employeeId;
        this.authorities = authorities;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long userId;
        private String username;
        private String role;
        private Long customerId;
        private Long employeeId;
        private Set<String> authorities;

        public Builder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public Builder username(String username) {
            this.username = username;
            return this;
        }

        public Builder role(String role) {
            this.role = role;
            return this;
        }

        public Builder customerId(Long customerId) {
            this.customerId = customerId;
            return this;
        }

        public Builder employeeId(Long employeeId) {
            this.employeeId = employeeId;
            return this;
        }

        public Builder authorities(Set<String> authorities) {
            this.authorities = authorities;
            return this;
        }

        public UserContext build() {
            return new UserContext(userId, username, role, customerId, employeeId, authorities);
        }
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public Set<String> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(Set<String> authorities) {
        this.authorities = authorities;
    }

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
        if (isAdmin()) return true;
        return authorities != null && authorities.contains(permission);
    }
}
