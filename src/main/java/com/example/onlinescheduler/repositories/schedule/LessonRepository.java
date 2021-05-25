package com.example.onlinescheduler.repositories.schedule;

import com.example.onlinescheduler.models.schedule.Lesson;
import com.example.onlinescheduler.models.schedule.TeachingHour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.validation.constraints.NotBlank;
import java.util.List;
import java.util.Optional;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    Optional<List<Lesson>> findAllByScheduleId(Long scheduleId);

    Optional<Lesson> findByTeachingHour_Id(Long teachingHourId);

    Boolean existsBySlotIndexAndWeekDayAndTeachingHour(
            @NotBlank Integer slotIndex,
            @NotBlank Integer weekDay,
            @NotBlank TeachingHour teachingHour);

    Boolean existsByScheduleId(Long scheduleId);
}
