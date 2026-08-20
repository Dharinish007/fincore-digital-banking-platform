package com.fincore.customerservice.enums;

import java.util.Set;

public enum Role {
    CUSTOMER(Set.of(
            "PROFILE_VIEW_OWN",
            "ACCOUNT_VIEW_OWN",
            "TRANSACTION_VIEW_OWN",
            "LOAN_APPLY",
            "LOAN_VIEW_OWN",
            "LOAN_APPLICATION_VIEW_OWN"
    )),
    EMPLOYEE(Set.of(
            "CUSTOMER_VIEW",
            "CUSTOMER_MANAGE",
            "ACCOUNT_VIEW",
            "ACCOUNT_OPERATE",
            "TRANSACTION_VIEW",
            "LOAN_VIEW",
            "LOAN_VIEW_ALL",
            "LOAN_REVIEW",
            "LOAN_ASSESS",
            "LOAN_APPROVE",
            "LOAN_REJECT",
            "LOAN_DISBURSE"
    )),
    ADMIN(Set.of(
            "USER_VIEW",
            "USER_MANAGE",
            "ROLE_VIEW",
            "ROLE_MANAGE",
            "PERMISSION_VIEW",
            "PERMISSION_MANAGE",
            "SYSTEM_CONFIG_MANAGE",
            "PRODUCT_MANAGE",
            "LOAN_PRODUCT_MANAGE",
            "AUDIT_VIEW",
            "CUSTOMER_VIEW",
            "CUSTOMER_MANAGE",
            "ACCOUNT_VIEW",
            "ACCOUNT_OPERATE",
            "TRANSACTION_VIEW",
            "LOAN_VIEW"
    ));

    private final Set<String> permissions;

    Role(Set<String> permissions) {
        this.permissions = permissions;
    }

    public Set<String> getPermissions() {
        return permissions;
    }
}
