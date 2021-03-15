package com.example.onlinescheduler.controllers.schedule;

import com.example.onlinescheduler.models.schedule.Lesson;
import com.example.onlinescheduler.payload.schedule.LessonRequest;
import com.example.onlinescheduler.repositories.schedule.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge =  3600)
@RestController
@RequestMapping("/api/public/lesson")
public class LessonController {

    @Autowired
    LessonRepository lessonRepository;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Lesson> createLesson(@RequestBody LessonRequest lessonRequest) {
        Lesson lesson = new Lesson(
                lessonRequest.getSchedule(),
                lessonRequest.getWeekDay(),
                lessonRequest.getSlotIndex(),
                lessonRequest.getTeachingHour()
        );

        if(!lessonRepository.existsBySlotIndexAndWeekDayAndTeachingHour(
                lesson.getSlotIndex(),
                lesson.getWeekDay(),
                lesson.getTeachingHour()
        )) {
            lessonRepository.save(lesson);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(lesson, HttpStatus.CREATED);
    }

    @GetMapping("schedule/{scheduleId}/exist/lessons")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Boolean> checkIfLessonsExist(@PathVariable Long scheduleId) {
        Boolean check = lessonRepository.existsByScheduleId(scheduleId);

        return (new ResponseEntity<>(check, HttpStatus.OK));
    }

    @GetMapping("/schedule/{scheduleId}/lessons")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Lesson>> getLessonsByScheduleId(@PathVariable Long scheduleId) {
        Optional<List<Lesson>> lessons = lessonRepository.findAllByScheduleId(scheduleId);

        return lessons.map(lessonsList -> new ResponseEntity<>(lessonsList, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Lesson>> getAllLessons() {
        List<Lesson> lessons = lessonRepository.findAll();

        if(lessons.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(lessons, HttpStatus.OK);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Lesson> getLessonById(@PathVariable Long id) {
        Optional<Lesson> lesson = lessonRepository.findById(id);

        return lesson.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Lesson> updateLessonInformation(@PathVariable Long id, @RequestBody Lesson lesson) {
        Optional<Lesson> foundLesson = lessonRepository.findById(id);

        if(foundLesson.isPresent()) {
            Lesson newLesson = foundLesson.get();
            newLesson.setSchedule(lesson.getSchedule());
            newLesson.setWeekDay(lesson.getWeekDay());
            newLesson.setSlotIndex(lesson.getSlotIndex());
            newLesson.setTeachingHour(lesson.getTeachingHour());
            return new ResponseEntity<>(lessonRepository.save(newLesson), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Lesson> deleteLesson(@PathVariable Long id) {
        Optional<Lesson> lesson = lessonRepository.findById(id);
        if (lesson.isPresent()) {
            lessonRepository.delete(lesson.get());
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}