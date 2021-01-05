package com.example.onlinescheduler.controllers.schedule.timeManegment;

import com.example.onlinescheduler.models.schedule.timeMangement.TimeSlot;
import com.example.onlinescheduler.payload.schedule.timeManegment.TimeSlotRequest;
import com.example.onlinescheduler.repositories.schedule.timeManegment.TimeSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge =  3600)
@RestController
@RequestMapping("/api/public/time-slot")
public class TimeSlotController {
    @Autowired
    TimeSlotRepository timeSlotRepository;

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<TimeSlot>> getAllTimeSlots() {
        List<TimeSlot> timeSlots = timeSlotRepository.findAll();

        if(timeSlots.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(timeSlots, HttpStatus.OK);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<TimeSlot> getTimeSlotById(@PathVariable Long id) {
        Optional<TimeSlot> timeSlot = timeSlotRepository.findById(id);

        return timeSlot.map(slot -> new ResponseEntity<>(slot, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/{timeTableId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<TimeSlot>> getAllTimeSlotsByTimeTableId(@PathVariable Long id) {
        Optional<List<TimeSlot>> timeSlots = timeSlotRepository.findAllByTimeTable_Id(id);

        if(timeSlots.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(timeSlots.get(), HttpStatus.OK);
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<TimeSlot> createTimeSlot(@RequestBody TimeSlotRequest timeSlotRequest) {
        //TODO: edit the time from the google tab
        /*
        TimeSlot timeSlot = new TimeSlot(
                timeSlotRequest.getWeekDay(),
                timeSlotRequest.getTimeStart(),
                timeSlotRequest.getTimeEnd(),
                timeSlotRequest.getTimeTable()
        );
        timeSlotRepository.save(timeSlot);
                return new ResponseEntity<>(timeSlot, HttpStatus.CREATED);

        */
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<TimeSlot> updateScheduleInformation(@PathVariable Long id, @RequestBody TimeSlot timeSlot ) {
        Optional<TimeSlot> foundTimeSlot = timeSlotRepository.findById(id);

        if(foundTimeSlot.isPresent()) {
            TimeSlot newTimeSlot = foundTimeSlot.get();
            //TODO: edit the time from the google tab
            newTimeSlot.setTimeTable(timeSlot.getTimeTable());
            newTimeSlot.setWeekDay(timeSlot.getWeekDay());

            return new ResponseEntity<>(timeSlotRepository.save(newTimeSlot), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<TimeSlot> deleteTimeSlot(@PathVariable Long id) {
        Optional<TimeSlot> foundTimeSlot = timeSlotRepository.findById(id);

        if(foundTimeSlot.isPresent()) {
            timeSlotRepository.delete(foundTimeSlot.get());
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
