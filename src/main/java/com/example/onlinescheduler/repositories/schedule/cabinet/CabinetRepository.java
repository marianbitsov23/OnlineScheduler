package com.example.onlinescheduler.repositories.schedule.cabinet;

import com.example.onlinescheduler.models.schedule.Schedule;
import com.example.onlinescheduler.models.schedule.Subject;
import com.example.onlinescheduler.models.schedule.cabinet.Cabinet;
import com.example.onlinescheduler.models.schedule.cabinet.CabinetCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface CabinetRepository extends JpaRepository<Cabinet, Long> {
    Optional<Cabinet> findById(Long id);

    Optional<List<Cabinet>> findAllCabinetsByScheduleId(Long scheduleId);

    Optional<Cabinet> findByScheduleAndName(
            Schedule schedule,
            String name
    );
}
