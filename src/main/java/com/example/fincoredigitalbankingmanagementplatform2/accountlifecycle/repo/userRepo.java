package com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.repo;

import com.example.fincoredigitalbankingmanagementplatform2.accountlifecycle.entity.userEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface userRepo extends JpaRepository<userEntity,Long> {
    Optional<userEntity> findByEmail(String email);
}