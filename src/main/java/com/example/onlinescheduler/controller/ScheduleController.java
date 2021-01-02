package com.example.onlinescheduler.controller;

import com.example.onlinescheduler.model.schedule.Cabinet;
import com.example.onlinescheduler.model.schedule.Subject;
import com.example.onlinescheduler.model.schedule.Teacher;
import com.example.onlinescheduler.repository.CabinetRepository;
import com.example.onlinescheduler.repository.ScheduleRepository;
import com.example.onlinescheduler.repository.SubjectRepository;
import com.example.onlinescheduler.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

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


}
