package com.example.onlinescheduler.repositories.schedule;

import com.example.onlinescheduler.models.schedule.Schedule;
import com.example.onlinescheduler.models.schedule.Subject;
import com.example.onlinescheduler.models.schedule.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Optional<Teacher> findById(Long id);

    Optional<List<Teacher>> findAllTeachersByScheduleId(Long scheduleId);

    Boolean existsByScheduleAndNameAndInitials(
            Schedule schedule,
            String name,
            String initials
    );
}
