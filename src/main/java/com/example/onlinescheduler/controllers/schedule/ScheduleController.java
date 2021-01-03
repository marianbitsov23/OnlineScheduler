package com.example.onlinescheduler.controllers.schedule;

import com.example.onlinescheduler.models.schedule.Schedule;
import com.example.onlinescheduler.repositories.schedule.CabinetRepository;
import com.example.onlinescheduler.repositories.schedule.ScheduleRepository;
import com.example.onlinescheduler.repositories.schedule.SubjectRepository;
import com.example.onlinescheduler.repositories.schedule.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge =  3600)
@RestController
@RequestMapping("/api/schedule")
public class ScheduleController {

    @Autowired
    ScheduleRepository scheduleRepository;

    @Autowired
    TeacherRepository teacherRepository;

    @Autowired
    SubjectRepository subjectRepository;

    @Autowired
    CabinetRepository cabinetRepository;

    /*
    @PostMapping
    public ResponseEntity<Schedule> createSchedule() {
    }
     */
}
