package com.example.onlinescheduler.controllers.schedule.timeManegment;

import com.example.onlinescheduler.models.schedule.Schedule;
import com.example.onlinescheduler.models.schedule.cabinet.Cabinet;
import com.example.onlinescheduler.models.schedule.timeMangement.TimeSlot;
import com.example.onlinescheduler.models.schedule.timeMangement.TimeTable;
import com.example.onlinescheduler.payload.schedule.timeManegment.TimeTableRequest;
import com.example.onlinescheduler.repositories.schedule.timeManegment.TimeSlotRepository;
import com.example.onlinescheduler.repositories.schedule.timeManegment.TimeTableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.sql.Time;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@CrossOrigin(origins = "*", maxAge =  3600)
@RestController
@RequestMapping("/api/public/time-table")
public class TimeTableController {
    @Autowired
    TimeTableRepository timeTableRepository;

    @Autowired
    TimeSlotRepository timeSlotRepository;

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

    @GetMapping("/schedule/{scheduleId}/time-tables")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<TimeTable>> getTimeTablesByScheduleId(@PathVariable Long scheduleId) {
        Optional<List<TimeTable>> timeTables = timeTableRepository.findAllTimeTablesByScheduleId(scheduleId);

        return timeTables.map(timeTableList -> new ResponseEntity<>(timeTableList, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<TimeTable> getTimeTableById(@PathVariable Long id) {
        Optional<TimeTable> timeTable = timeTableRepository.findById(id);

        return timeTable.map(table -> new ResponseEntity<>(table, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("copy/{oldScheduleId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> copyTimeTablesForSchedule(@PathVariable Long oldScheduleId, @RequestBody Schedule newSchedule) {
        Optional<List<TimeTable>> oldTmeTables = timeTableRepository.findAllTimeTablesByScheduleId(oldScheduleId);

        if(oldTmeTables.isPresent()){
            for(TimeTable tt : oldTmeTables.get()) {
                Optional<List<TimeSlot>> timeSlots = timeSlotRepository.findAllByTimeTable_Id(tt.getId());
                TimeTable newTimeTable = new TimeTable(
                        newSchedule,
                        tt.getName()
                );
                timeTableRepository.save(newTimeTable);
                if(timeSlots.isPresent()) {
                    for(TimeSlot ts : timeSlots.get()) {
                        TimeSlot newTimeSlot = new TimeSlot(
                                ts.getWeekDay(),
                                ts.getTimeStart(),
                                ts.getTimeEnd(),
                                newTimeTable
                        );
                        timeSlotRepository.save(newTimeSlot);
                    }
                } else {
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }
            }
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<TimeTable> createTimeTable(@RequestBody TimeTableRequest timeTableRequest) {
        //TODO: Make no duplicate table names
        TimeTable timeTable = new TimeTable(
                timeTableRequest.getSchedule(),
                timeTableRequest.getName()
        );
        timeTableRepository.save(timeTable);

        return new ResponseEntity<>(timeTable, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<TimeTable> updateTimeTableInformation(@PathVariable Long id, @RequestBody TimeTable timeTable ) {
        Optional<TimeTable> foundTimeTable = timeTableRepository.findById(id);

        if(foundTimeTable.isPresent()) {
            TimeTable newTimeTable = foundTimeTable.get();
            newTimeTable.setName(timeTable.getName());
            newTimeTable.setSchedule(timeTable.getSchedule());

            return new ResponseEntity<>(timeTableRepository.save(newTimeTable), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<TimeTable> deleteTimeTable(@PathVariable Long id) {
        Optional<TimeTable> foundTimeTable = timeTableRepository.findById(id);

        if(foundTimeTable.isPresent()) {
            timeTableRepository.delete(foundTimeTable.get());
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
