package com.example.onlinescheduler.controllers.schedule;

import com.example.onlinescheduler.models.schedule.TeachingHour;
import com.example.onlinescheduler.payload.schedule.TeachingHourRequest;
import com.example.onlinescheduler.repositories.schedule.TeachingHourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge =  3600)
@RestController
@RequestMapping("/api/public/teaching-hour")
public class TeachingHourController {

    @Autowired
    TeachingHourRepository teachingHourRepository;

    @GetMapping
    public ResponseEntity<List<TeachingHour>> getAllHours() {
        List<TeachingHour> allHours = teachingHourRepository.findAll();

        if(allHours.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(allHours, HttpStatus.OK);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeachingHour> getHourById(@PathVariable Long id) {
       Optional<TeachingHour> foundHour = teachingHourRepository.findById(id);

        return foundHour.map(hours -> new ResponseEntity<>(hours, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<TeachingHour> createHour(@RequestBody TeachingHourRequest teachingHourRequest) {
        TeachingHour newTeachingHour = new TeachingHour(
                teachingHourRequest.getSubject(),
                teachingHourRequest.getTeacher(),
                teachingHourRequest.getHoursPerWeek(),
                teachingHourRequest.getOverAWeek(),
                teachingHourRequest.getCabinet(),
                teachingHourRequest.getTimeSlots(),
                teachingHourRequest.getSchedule()
        );

        teachingHourRepository.save(newTeachingHour);

        return new ResponseEntity<>(newTeachingHour, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeachingHour> updateHourInformation(@PathVariable Long id, @RequestBody TeachingHour teachingHour) {
        Optional<TeachingHour> foundTeachingHour = teachingHourRepository.findById(id);

        if(foundTeachingHour.isPresent()) {
            TeachingHour newTeachingHour =  foundTeachingHour.get();
            newTeachingHour.setTeacher(teachingHour.getTeacher());
            newTeachingHour.setHoursPerWeek(teachingHour.getHoursPerWeek());
            newTeachingHour.setOverAWeek(teachingHour.getOverAWeek());
            newTeachingHour.setCabinet(teachingHour.getCabinet());
            newTeachingHour.setTimeSlots(teachingHour.getTimeSlots());
            newTeachingHour.setSchedule(teachingHour.getSchedule());
            return new ResponseEntity<>(teachingHourRepository.save(newTeachingHour), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<TeachingHour> deleteHour(@PathVariable Long id) {
        Optional<TeachingHour> teachingHour = teachingHourRepository.findById(id);
        if(teachingHour.isPresent()) {
            teachingHourRepository.delete(teachingHour.get());
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
