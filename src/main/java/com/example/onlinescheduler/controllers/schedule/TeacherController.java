package com.example.onlinescheduler.controllers.schedule;

import com.example.onlinescheduler.models.schedule.Schedule;
import com.example.onlinescheduler.models.schedule.Subject;
import com.example.onlinescheduler.models.schedule.Teacher;
import com.example.onlinescheduler.models.schedule.TeachingHour;
import com.example.onlinescheduler.payload.schedule.TeacherRequest;
import com.example.onlinescheduler.repositories.schedule.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge =  3600)
@RestController
@RequestMapping("/api/public/teacher")
public class TeacherController {
    @Autowired
    TeacherRepository teacherRepository;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Teacher> createTeacher(@RequestBody TeacherRequest teacherRequest) {
        Teacher teacher = new Teacher(
                teacherRequest.getName(),
                teacherRequest.getInitials(),
                teacherRequest.getSchedule()
        );
        teacherRepository.save(teacher);

        return new ResponseEntity<>(teacher, HttpStatus.CREATED);
    }

    @PostMapping("copy/{oldScheduleId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> copyTeachersFromSchedule(@PathVariable Long oldScheduleId, @RequestBody Schedule newSchedule) {
        Optional<List<Teacher>> teachers = teacherRepository.findAllTeachersByScheduleId(oldScheduleId);

        if(teachers.isPresent()) {
            for(Teacher t : teachers.get()) {
                Teacher newTeacher = new Teacher(t.getName(), t.getInitials(), newSchedule);
                teacherRepository.save(newTeacher);
            }
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @GetMapping("/schedule/{scheduleId}/teachers")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Teacher>> getTeachersByScheduleId(@PathVariable Long scheduleId) {
        Optional<List<Teacher>> teachers = teacherRepository.findAllTeachersByScheduleId(scheduleId);

        return teachers.map(teacherList -> new ResponseEntity<>(teacherList, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Teacher>> getAllTeachers() {
        List<Teacher> teachers = teacherRepository.findAll();

        if(teachers.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(teachers, HttpStatus.OK);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Teacher> getTeacherById(@PathVariable Long id) {
        Optional<Teacher> teacher = teacherRepository.findById(id);

        return teacher.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Teacher> updateTeacherInformation(@PathVariable Long id, @RequestBody Teacher teacher) {
        Optional<Teacher> foundTeacher = teacherRepository.findById(id);

        if(foundTeacher.isPresent()) {
            Teacher newTeacher = foundTeacher.get();
            newTeacher.setName(teacher.getName());
            newTeacher.setInitials(teacher.getInitials());
            return new ResponseEntity<>(teacherRepository.save(newTeacher), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Teacher> deleteTeacher(@PathVariable Long id) {
        Optional<Teacher> teacher = teacherRepository.findById(id);
        if(teacher.isPresent()) {
            teacherRepository.delete(teacher.get());
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
