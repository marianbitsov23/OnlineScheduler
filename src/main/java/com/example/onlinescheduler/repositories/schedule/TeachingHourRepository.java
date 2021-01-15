package com.example.onlinescheduler.repositories.schedule;

import com.example.onlinescheduler.models.schedule.Schedule;
import com.example.onlinescheduler.models.schedule.Teacher;
import com.example.onlinescheduler.models.schedule.TeachingHour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeachingHourRepository extends JpaRepository<TeachingHour, Long> {
    Optional<TeachingHour> findById(Long id);

    Optional<List<TeachingHour>> findAllTeachingHoursByScheduleId(Long scheduleId);
}
