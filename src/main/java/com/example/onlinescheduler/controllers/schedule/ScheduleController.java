package com.example.onlinescheduler.controllers.schedule;

import com.example.onlinescheduler.models.schedule.Schedule;
import com.example.onlinescheduler.payload.schedule.ScheduleRequest;
import com.example.onlinescheduler.repositories.schedule.CabinetRepository;
import com.example.onlinescheduler.repositories.schedule.ScheduleRepository;
import com.example.onlinescheduler.repositories.schedule.SubjectRepository;
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
@RequestMapping("/api/public/schedule")
public class ScheduleController {

    @Autowired
    ScheduleRepository scheduleRepository;

    @Autowired
    TeacherRepository teacherRepository;

    @Autowired
    SubjectRepository subjectRepository;

    @Autowired
    CabinetRepository cabinetRepository;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Schedule> createSchedule(@RequestBody ScheduleRequest scheduleRequest) {
        Schedule schedule = new Schedule(
                scheduleRequest.getScheduleName(),
                scheduleRequest.getDescription(),
                scheduleRequest.getCreator()
        );

        scheduleRepository.save(schedule);

        return new ResponseEntity<>(schedule, HttpStatus.CREATED);
    }


    @GetMapping("/user/{creatorId}/schedules")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Schedule>> getSchedulesByCreator(@PathVariable Long creatorId) {
        Optional<List<Schedule>> schedules = scheduleRepository.findAllByCreator_Id(creatorId);

        return schedules.map(scheduleList -> new ResponseEntity<>(scheduleList, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Schedule> getScheduleById(@PathVariable Long id) {
        Optional<Schedule> foundSchedule = scheduleRepository.findById(id);

        return foundSchedule.map(schedule -> new ResponseEntity<>(schedule, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Schedule> updateScheduleInformation(@PathVariable Long id, @RequestBody Schedule schedule ) {
        Optional<Schedule> foundSchedule = scheduleRepository.findById(id);

        if(foundSchedule.isPresent()) {
            Schedule newSchedule = foundSchedule.get();
            newSchedule.setScheduleName(schedule.getScheduleName());
            newSchedule.setCreator(schedule.getCreator());
            newSchedule.setHours(schedule.getHours());
            newSchedule.setDescription(schedule.getDescription());

            return new ResponseEntity<>(scheduleRepository.save(newSchedule), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Schedule> deleteSchedule(@PathVariable Long id) {
        Optional<Schedule> foundSchedule = scheduleRepository.findById(id);

        if(foundSchedule.isPresent()) {
            scheduleRepository.delete(foundSchedule.get());
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
