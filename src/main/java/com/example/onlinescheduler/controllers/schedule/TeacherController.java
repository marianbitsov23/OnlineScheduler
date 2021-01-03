package com.example.onlinescheduler.controllers.schedule;

import com.example.onlinescheduler.models.schedule.Subject;
import com.example.onlinescheduler.models.schedule.Teacher;
import com.example.onlinescheduler.payload.schedule.TeacherRequest;
import com.example.onlinescheduler.repositories.schedule.SubjectRepository;
import com.example.onlinescheduler.repositories.schedule.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
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
    public ResponseEntity<Teacher> createTeacher(TeacherRequest teacherRequest) {
        for(Subject subject : teacherRequest.getSubjects()) {
            if(subjectRepository.findById(subject.getId()).isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }
        Teacher teacher = new Teacher(teacherRequest.getTeacherName(), teacherRequest.getSubjects());
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
