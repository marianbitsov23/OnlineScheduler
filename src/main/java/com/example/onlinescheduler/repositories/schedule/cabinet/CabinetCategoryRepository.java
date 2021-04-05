package com.example.onlinescheduler.repositories.schedule.cabinet;

import com.example.onlinescheduler.models.schedule.Schedule;
import com.example.onlinescheduler.models.schedule.TeachingHour;
import com.example.onlinescheduler.models.schedule.cabinet.Cabinet;
import com.example.onlinescheduler.models.schedule.cabinet.CabinetCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CabinetCategoryRepository extends JpaRepository<CabinetCategory, Long> {
    Optional<List<CabinetCategory>> findAllCabinetCategoriesByScheduleId(Long scheduleId);

    Optional<List<CabinetCategory>> findAllBySchedule(Schedule schedule);

    Optional<CabinetCategory> findByNameAndSchedule(String name, Schedule schedule);
}
