package com.example.onlinescheduler.controllers.schedule.timeManegment;

import com.example.onlinescheduler.models.schedule.timeMangement.TimeSlot;
import com.example.onlinescheduler.models.schedule.timeMangement.TimeTable;
import com.example.onlinescheduler.payload.schedule.timeManegment.TimeTableRequest;
import com.example.onlinescheduler.repositories.schedule.timeManegment.TimeTableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge =  3600)
@RestController
@RequestMapping("/api/public/time-table")
public class TimeTableController {
    @Autowired
    TimeTableRepository timeTableRepository;

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<TimeTable>> getAllTimeTables() {
        List<TimeTable> timeTables = timeTableRepository.findAll();

        if(timeTables.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(timeTables, HttpStatus.OK);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<TimeTable> getTimeTableById(@PathVariable Long id) {
        Optional<TimeTable> timeTable = timeTableRepository.findById(id);

        return timeTable.map(table -> new ResponseEntity<>(table, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<TimeTable> createTimeTable(@RequestBody TimeTableRequest timeTableRequest) {
        TimeTable timeTable = new TimeTable(
                timeTableRequest.getSchedule(),
                timeTableRequest.getTimeTableName(),
                timeTableRequest.getTimeSlots()
        );
        timeTableRepository.save(timeTable);

        return new ResponseEntity<>(timeTable, HttpStatus.CREATED);
    }
}
