package com.example.milestone2loanmanagement.collection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollectionRepo extends JpaRepository<CollectionEntity,Long> {
    List<CollectionEntity> findByEmiLoanId(Long loanId);

    List<CollectionEntity> findByStatus(String status);
}
