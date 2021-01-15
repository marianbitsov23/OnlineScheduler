package com.example.onlinescheduler.repositories.schedule;

import com.example.onlinescheduler.models.schedule.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    Optional<Subject> findById(Long Id);

    Optional<List<Subject>> findAllSubjectsByScheduleId(Long scheduleId);
}
