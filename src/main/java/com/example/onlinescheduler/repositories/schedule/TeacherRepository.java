package com.example.onlinescheduler.repositories.schedule;

import com.example.onlinescheduler.models.schedule.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
}
