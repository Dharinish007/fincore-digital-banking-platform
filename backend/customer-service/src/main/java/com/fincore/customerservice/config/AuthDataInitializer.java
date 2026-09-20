package com.fincore.customerservice.config;

import com.fincore.customerservice.entity.Customer;
import com.fincore.customerservice.entity.Employee;
import com.fincore.customerservice.entity.User;
import com.fincore.customerservice.enums.CustomerStatus;
import com.fincore.customerservice.enums.KycStatus;
import com.fincore.customerservice.enums.RiskLevel;
import com.fincore.customerservice.enums.Role;
import com.fincore.customerservice.repository.CustomerRepository;
import com.fincore.customerservice.repository.EmployeeRepository;
import com.fincore.customerservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuthDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Checking and seeding FinCore identity and domain data...");

        // 1. Seed Customer 1 if not exists (John Doe)
        Customer customer1 = customerRepository.findByCustomerNumber("CUST-1001")
                .or(() -> customerRepository.findByEmailIgnoreCase("john.doe@example.com"))
                .or(() -> customerRepository.findById(1L))
                .orElseGet(() -> {
                    Customer c = Customer.builder()
                            .customerNumber("CUST-1001")
                            .firstName("John")
                            .lastName("Doe")
                            .email("john.doe@example.com")
                            .phoneNumber("9876543211")
                            .dateOfBirth(LocalDate.of(1990, 1, 15))
                            .address("100 Wall Street")
                            .city("New York")
                            .state("NY")
                            .postalCode("10005")
                            .country("USA")
                            .kycStatus(KycStatus.VERIFIED)
                            .riskLevel(RiskLevel.LOW)
                            .status(CustomerStatus.ACTIVE)
                            .build();
                    return customerRepository.save(c);
                });

        // 2. Find Customer 2 if exists (Ravana Kumar)
        Customer customer2 = customerRepository.findById(2L)
                .or(() -> customerRepository.findByCustomerNumber("CUST-606092C3"))
                .orElse(null);

        // 3. Seed Employee (Sarah Jenkins - Senior Loan Officer)
        Employee employee1 = employeeRepository.findByEmployeeNumber("EMP-1001").orElseGet(() -> {
            Employee emp = Employee.builder()
                    .employeeNumber("EMP-1001")
                    .firstName("Sarah")
                    .lastName("Jenkins")
                    .email("sarah.jenkins@fincore.bank")
                    .department("Credit & Lending Operations")
                    .jobTitle("Senior Loan Officer")
                    .status("ACTIVE")
                    .build();
            return employeeRepository.save(emp);
        });

        // 4. Seed Users
        // Admin
        if (!userRepository.existsByUsernameIgnoreCase("admin")) {
            userRepository.save(User.builder()
                    .username("admin")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .fullName("Administrator")
                    .email("admin@fincore.bank")
                    .role(Role.ADMIN)
                    .enabled(true)
                    .build());
            log.info("Seeded ADMIN user 'admin'");
        }

        // Employee
        if (!userRepository.existsByUsernameIgnoreCase("employee")) {
            userRepository.save(User.builder()
                    .username("employee")
                    .passwordHash(passwordEncoder.encode("employee123"))
                    .fullName("Sarah Jenkins")
                    .email("employee@fincore.bank")
                    .role(Role.EMPLOYEE)
                    .employeeId(employee1.getId())
                    .enabled(true)
                    .build());
            log.info("Seeded EMPLOYEE user 'employee' linked to employeeId={}", employee1.getId());
        }

        // Customer 1 (John Doe)
        userRepository.findByUsernameIgnoreCase("customer").ifPresentOrElse(
                u -> {
                    if (customer1 != null && (u.getCustomerId() == null || !u.getCustomerId().equals(customer1.getId()))) {
                        u.setCustomerId(customer1.getId());
                        userRepository.save(u);
                        log.info("Synchronized CUSTOMER user 'customer' to active customerId={}", customer1.getId());
                    }
                },
                () -> {
                    userRepository.save(User.builder()
                            .username("customer")
                            .passwordHash(passwordEncoder.encode("customer123"))
                            .fullName(customer1.getFirstName() + " " + customer1.getLastName())
                            .email(customer1.getEmail())
                            .role(Role.CUSTOMER)
                            .customerId(customer1.getId())
                            .enabled(true)
                            .build());
                    log.info("Seeded CUSTOMER user 'customer' linked to customerId={}", customer1.getId());
                }
        );

        // Customer 2 (Ravana Kumar)
        if (customer2 != null) {
            final Customer finalCust2 = customer2;
            userRepository.findByUsernameIgnoreCase("ravana").ifPresentOrElse(
                    u -> {
                        if (u.getCustomerId() == null || !u.getCustomerId().equals(finalCust2.getId())) {
                            u.setCustomerId(finalCust2.getId());
                            userRepository.save(u);
                            log.info("Synchronized CUSTOMER user 'ravana' to active customerId={}", finalCust2.getId());
                        }
                    },
                    () -> {
                        userRepository.save(User.builder()
                                .username("ravana")
                                .passwordHash(passwordEncoder.encode("customer123"))
                                .fullName(finalCust2.getFirstName() + " " + finalCust2.getLastName())
                                .email(finalCust2.getEmail())
                                .role(Role.CUSTOMER)
                                .customerId(finalCust2.getId())
                                .enabled(true)
                                .build());
                        log.info("Seeded CUSTOMER user 'ravana' linked to customerId={}", finalCust2.getId());
                    }
            );
        }

        log.info("FinCore IAM Data Initialization complete.");
    }
}
