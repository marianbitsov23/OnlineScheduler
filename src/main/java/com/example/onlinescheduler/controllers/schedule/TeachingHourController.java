package com.example.onlinescheduler.controllers.schedule;

import com.example.onlinescheduler.models.schedule.*;
import com.example.onlinescheduler.models.schedule.cabinet.Cabinet;
import com.example.onlinescheduler.models.schedule.timeMangement.TimeSlot;
import com.example.onlinescheduler.models.schedule.timeMangement.TimeTable;
import com.example.onlinescheduler.payload.schedule.TeachingHourRequest;
import com.example.onlinescheduler.repositories.schedule.GroupRepository;
import com.example.onlinescheduler.repositories.schedule.SubjectRepository;
import com.example.onlinescheduler.repositories.schedule.TeacherRepository;
import com.example.onlinescheduler.repositories.schedule.TeachingHourRepository;
import com.example.onlinescheduler.repositories.schedule.cabinet.CabinetRepository;
import com.example.onlinescheduler.repositories.schedule.timeManegment.TimeSlotRepository;
import com.example.onlinescheduler.repositories.schedule.timeManegment.TimeTableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@CrossOrigin(origins = "*", maxAge =  3600)
@RestController
@RequestMapping("/api/public/teaching-hour")
public class TeachingHourController {

    @Autowired
    TeachingHourRepository teachingHourRepository;

    @Autowired
    SubjectRepository subjectRepository;

    @Autowired
    TeacherRepository teacherRepository;

    @Autowired
    GroupRepository groupRepository;

    @Autowired
    CabinetRepository cabinetRepository;

    @Autowired
    TimeSlotRepository timeSlotRepository;

    @Autowired
    TimeTableRepository timeTableRepository;

    @GetMapping
    public ResponseEntity<List<TeachingHour>> getAllHours() {
        List<TeachingHour> allHours = teachingHourRepository.findAll();

        if(allHours.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(allHours, HttpStatus.OK);
        }
    }

    @GetMapping("/schedule/{scheduleId}/teaching-hours")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<TeachingHour>> getTeachingHoursByScheduleId(@PathVariable Long scheduleId) {
        Optional<List<TeachingHour>> teachingHours = teachingHourRepository.findAllTeachingHoursByScheduleId(scheduleId);

        return teachingHours.map(teachingHourList -> new ResponseEntity<>(teachingHourList, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<TeachingHour> getHourById(@PathVariable Long id) {
       Optional<TeachingHour> foundHour = teachingHourRepository.findById(id);

        return foundHour.map(hours -> new ResponseEntity<>(hours, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/group/{groupId}/teaching-hours")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<TeachingHour>> getTeachingHoursByGroupId(@PathVariable Long groupId) {
        Optional<List<TeachingHour>> teachingHours = teachingHourRepository.findAllByGroupId(groupId);

        return teachingHours.map(teachingHourList -> new ResponseEntity<>(teachingHourList, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<TeachingHour> createHour(@RequestBody TeachingHourRequest teachingHourRequest) {
        TeachingHour newTeachingHour = new TeachingHour(
                teachingHourRequest.getSubject(),
                teachingHourRequest.getGroup(),
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

    @PostMapping("copy/{oldScheduleId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> copyTeachingHoursFromSchedule(@PathVariable Long oldScheduleId, @RequestBody Schedule newSchedule) {
        Optional<List<TeachingHour>> teachingHours = teachingHourRepository.findAllTeachingHoursByScheduleId(oldScheduleId);

        if(teachingHours.isPresent()) {
            for(TeachingHour th : teachingHours.get()) {
                Optional<Subject> foundSubject = subjectRepository.findByScheduleAndName(newSchedule, th.getSubject().getName());
                Optional<Teacher> foundTeacher = teacherRepository.findByScheduleAndNameAndInitials(
                        newSchedule,
                        th.getTeacher().getName(),
                        th.getTeacher().getInitials()
                );
                Optional<Group> foundGroup = groupRepository.findByScheduleAndName(
                        newSchedule,
                        th.getGroup().getName()
                );
                Optional<Cabinet> foundCabinet = cabinetRepository.findByScheduleAndName(
                        newSchedule,
                        th.getCabinet().getName()
                );

                Optional<TimeTable> foundTimeTable = timeTableRepository.findByNameAndSchedule(
                        th.getTimeSlots().stream().findFirst().get().getTimeTable().getName(),
                        newSchedule
                );

                if(foundTimeTable.isPresent() && foundSubject.isPresent()
                && foundCabinet.isPresent() && foundGroup.isPresent() && foundTeacher.isPresent()) {

                    TeachingHour newTeachingHour = new TeachingHour(
                            foundSubject.get(),
                            foundGroup.get(),
                            foundTeacher.get(),
                            th.getHoursPerWeek(),
                            th.getOverAWeek(),
                            foundCabinet.get(),
                            getNewTimeSlotsForTeachingHour(th, foundTimeTable.get()),
                            newSchedule
                    );

                    teachingHourRepository.save(newTeachingHour);
                } else {
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }
            }
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public Set<TimeSlot> getNewTimeSlotsForTeachingHour(TeachingHour th, TimeTable foundTimeTable) {
        Optional<List<TimeSlot>> foundTimeSlots = timeSlotRepository.findAllByTimeTable_Id(foundTimeTable.getId());
        Set<TimeSlot> newTimeSlots = new HashSet<>();
        if(foundTimeSlots.isPresent()){
            for(TimeSlot teachingHourTimeSlot : th.getTimeSlots()) {
                for(TimeSlot foundTimeSlot : foundTimeSlots.get()) {
                    if(teachingHourTimeSlot.getTimeEnd().equals(foundTimeSlot.getTimeEnd())
                            && teachingHourTimeSlot.getTimeStart().equals(foundTimeSlot.getTimeStart())
                            && teachingHourTimeSlot.getWeekDay().equals(foundTimeSlot.getWeekDay())) {
                        newTimeSlots.add(foundTimeSlot);
                    }
                }
            }
        }

        return newTimeSlots;
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
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
