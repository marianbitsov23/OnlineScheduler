package com.example.onlinescheduler.repositories.schedule.timeManegment;

import com.example.onlinescheduler.models.schedule.timeMangement.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {}
