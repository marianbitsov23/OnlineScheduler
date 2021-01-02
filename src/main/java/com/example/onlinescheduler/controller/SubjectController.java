package com.example.onlinescheduler.controller;

import com.example.onlinescheduler.model.schedule.Subject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge =  3600)
@RestController
@RequestMapping("/api/subject")
public class SubjectController {
    @PostMapping
    public ResponseEntity<Subject> createSubject(String subjectName) {
        Subject subject = new Subject(subjectName);

        return new ResponseEntity<>(subject, HttpStatus.CREATED);
    }
}
