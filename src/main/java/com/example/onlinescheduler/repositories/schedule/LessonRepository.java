package com.example.onlinescheduler.repositories.schedule;

import com.example.onlinescheduler.models.schedule.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    Optional<List<Lesson>> findAllByScheduleId(Long scheduleId);
}
