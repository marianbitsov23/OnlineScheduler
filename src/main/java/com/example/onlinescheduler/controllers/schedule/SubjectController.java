package com.example.onlinescheduler.controllers.schedule;

import com.example.onlinescheduler.models.schedule.Subject;
import com.example.onlinescheduler.payload.schedule.SubjectRequest;
import com.example.onlinescheduler.repositories.schedule.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge =  3600)
@RestController
@RequestMapping("/api/subject")
public class SubjectController {
    @Autowired
    SubjectRepository subjectRepository;

    @PostMapping
    public ResponseEntity<Subject> createSubject(@RequestBody SubjectRequest subjectRequest) {
        Subject subject = new Subject(subjectRequest.getSubjectName());
        subjectRepository.save(subject);
        return new ResponseEntity<>(subject, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Subject>> getAllSubjects() {
        List<Subject> subjects = subjectRepository.findAll();

        if(subjects.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(subjects, HttpStatus.FOUND);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Subject> getSubjectById(@PathVariable Long id) {
        Optional<Subject> subject = subjectRepository.findById(id);

        return subject.map(value -> new ResponseEntity<>(value, HttpStatus.FOUND))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Subject> updateSubjectInformation(@PathVariable Long id, @RequestBody Subject subject) {
        Optional<Subject> foundSubject = subjectRepository.findById(id);

        if(foundSubject.isPresent()) {
            Subject newSubject = foundSubject.get();
            newSubject.setSubjectName(subject.getSubjectName());
            newSubject.setTeachers(subject.getTeachers());
            return new ResponseEntity<>(subjectRepository.save(newSubject), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Subject> deleteSubject(@PathVariable Long id) {
        Optional<Subject> subject = subjectRepository.findById(id);
        if (subject.isPresent()) {
            subjectRepository.delete(subject.get());
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}