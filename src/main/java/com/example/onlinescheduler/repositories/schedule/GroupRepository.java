package com.example.onlinescheduler.repositories.schedule;

import com.example.onlinescheduler.models.schedule.Group;
import com.example.onlinescheduler.models.schedule.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {
    Optional<List<Group>> findAllByScheduleId(Long scheduleId);

    Optional<List<Group>> findAllByParentId(Long parentId);

    Optional<Group> findByScheduleAndNameAndParent(
            Schedule schedule,
            String name,
            Group parent
    );
}
