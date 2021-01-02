package com.example.onlinescheduler.controller;

import com.example.onlinescheduler.model.schedule.Cabinet;
import com.example.onlinescheduler.model.schedule.Subject;
import com.example.onlinescheduler.model.schedule.Teacher;
import com.example.onlinescheduler.repository.SubjectRepository;
import com.example.onlinescheduler.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@CrossOrigin(origins = "*", maxAge =  3600)
@RestController
@RequestMapping("/api/auth/teacher")
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

    @GetMapping
    public ResponseEntity<List<Teacher>> getAllTeachers() {
        List<Teacher> teachers = teacherRepository.findAll();

        if(teachers.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(teachers, HttpStatus.FOUND);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Teacher> getTeacherById(@PathVariable Long id) {
        Optional<Teacher> teacher = teacherRepository.findById(id);

        return teacher.map(value -> new ResponseEntity<>(value, HttpStatus.FOUND))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Teacher> updateTeacherInformation(@PathVariable Long id, @RequestBody Teacher teacher) {
        Optional<Teacher> foundTeacher = teacherRepository.findById(id);

        if(foundTeacher.isPresent()) {
            Teacher newTeacher = foundTeacher.get();
            newTeacher.setTeacherName(teacher.getTeacherName());
            newTeacher.setSubjects(teacher.getSubjects());
            return new ResponseEntity<>(teacherRepository.save(newTeacher), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Teacher> deleteTeacher(@PathVariable Long id) {
        Optional<Teacher> teacher = teacherRepository.findById(id);
        if (teacher.isPresent()) {
            teacherRepository.delete(teacher.get());
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
