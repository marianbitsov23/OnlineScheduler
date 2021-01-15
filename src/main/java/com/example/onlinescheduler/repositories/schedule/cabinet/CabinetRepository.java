package com.example.onlinescheduler.repositories.schedule.cabinet;

import com.example.onlinescheduler.models.schedule.Subject;
import com.example.onlinescheduler.models.schedule.cabinet.Cabinet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CabinetRepository extends JpaRepository<Cabinet, Long> {
    Optional<Cabinet> findById(Long id);

    Optional<List<Cabinet>> findAllCabinetsByScheduleId(Long scheduleId);
}
