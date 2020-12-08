package com.example.onlinescheduler.repository;

import com.example.onlinescheduler.model.Cabinet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CabinetRepository extends JpaRepository<Cabinet, Long> {
    Optional<Cabinet> findById(Long id);
}
