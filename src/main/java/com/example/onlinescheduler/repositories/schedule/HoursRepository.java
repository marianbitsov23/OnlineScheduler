package com.example.onlinescheduler.repositories.schedule;

import com.example.onlinescheduler.models.schedule.Hours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HoursRepository extends JpaRepository<Hours, Long> {
    Optional<Hours> findById(Long id);
}
