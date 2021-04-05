package com.example.onlinescheduler.controllers.schedule;

import com.example.onlinescheduler.models.schedule.*;
import com.example.onlinescheduler.models.schedule.cabinet.Cabinet;
import com.example.onlinescheduler.models.schedule.timeMangement.TimeTable;
import com.example.onlinescheduler.payload.schedule.TeachingHourRequest;
import com.example.onlinescheduler.repositories.schedule.GroupRepository;
import com.example.onlinescheduler.repositories.schedule.SubjectRepository;
import com.example.onlinescheduler.repositories.schedule.TeacherRepository;
import com.example.onlinescheduler.repositories.schedule.TeachingHourRepository;
import com.example.onlinescheduler.repositories.schedule.cabinet.CabinetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

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
                Optional<Group> foundGroup = groupRepository.findByScheduleAndNameAndParent(
                        newSchedule,
                        th.getGroup().getName(),
                        th.getGroup().getParent()
                );
                Optional<Cabinet> foundCabinet = cabinetRepository.findByScheduleAndName(
                        newSchedule,
                        th.getCabinet().getName()
                );


                TeachingHour newTeachingHour = new TeachingHour(
                        foundSubject.orElseGet(() -> subjectRepository.save(
                                new Subject(th.getSubject().getName(), newSchedule)
                        )),
                        foundGroup.orElseGet(() -> groupRepository.save(
                                new Group(th.getGroup().getParent(), th.getGroup().getName(), newSchedule)
                        )),
                        foundTeacher.orElseGet(() -> teacherRepository.save(
                                new Teacher(th.getTeacher().getName(), th.getTeacher().getInitials(), newSchedule)
                        )),
                        th.getHoursPerWeek(),
                        th.getOverAWeek(),
                        foundCabinet.orElseGet(() -> cabinetRepository.save(
                                new Cabinet(th.getCabinet().getName(),
                                        newSchedule,
                                        th.getCabinet().getCabinetCategories())
                        )),
                        th.getTimeSlots(),
                        newSchedule
                );

                teachingHourRepository.save(newTeachingHour);

            }
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
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
