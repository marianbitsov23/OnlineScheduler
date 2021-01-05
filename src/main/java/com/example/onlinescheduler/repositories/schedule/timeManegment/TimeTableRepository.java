package com.example.onlinescheduler.repositories.schedule.timeManegment;

import com.example.onlinescheduler.models.schedule.timeMangement.TimeTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TimeTableRepository extends JpaRepository<TimeTable, Long> {}
