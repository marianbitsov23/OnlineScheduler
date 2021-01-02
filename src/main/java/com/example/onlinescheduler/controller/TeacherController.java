package com.example.onlinescheduler.controller;

import com.example.onlinescheduler.model.schedule.Subject;
import com.example.onlinescheduler.model.schedule.Teacher;
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
@RequestMapping("/api/teacher")
public class TeacherController {
    @Autowired
    SubjectRepository subjectRepository;

    @Autowired
    TeacherRepository teacherRepository;

    @PostMapping
    public ResponseEntity<Teacher> createTeacher(String teacherName, Set<Subject> subjects) {
        for(Subject subject : subjects) {
            if(subjectRepository.findById(subject.getId()).isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }
        Teacher teacher = new Teacher(teacherName, subjects);
        teacherRepository.save(teacher);

        return new ResponseEntity<>(teacher, HttpStatus.CREATED);
    }
}
