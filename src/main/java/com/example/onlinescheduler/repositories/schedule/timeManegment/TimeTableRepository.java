package com.example.onlinescheduler.repositories.schedule.timeManegment;

import com.example.onlinescheduler.models.schedule.Schedule;
import com.example.onlinescheduler.models.schedule.Subject;
import com.example.onlinescheduler.models.schedule.timeMangement.TimeTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TimeTableRepository extends JpaRepository<TimeTable, Long> {
    Optional<List<TimeTable>> findAllTimeTablesByScheduleId(Long scheduleId);

    Optional<TimeTable> findByNameAndSchedule(String name, Schedule schedule);
}
