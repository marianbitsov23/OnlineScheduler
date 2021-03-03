package com.example.onlinescheduler.controllers.schedule;

import com.example.onlinescheduler.models.schedule.Group;
import com.example.onlinescheduler.payload.schedule.GroupRequest;
import com.example.onlinescheduler.repositories.schedule.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge =  3600)
@RestController
@RequestMapping("/api/public/group")
public class GroupController {
    @Autowired
    GroupRepository groupRepository;

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Group>> getAllGroups() {
        List<Group> allGroups = groupRepository.findAll();

        if(allGroups.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(allGroups, HttpStatus.OK);
        }
    }

    @GetMapping("/teaching/{scheduleId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Group>> getAllTeachingGroups(@PathVariable Long scheduleId) {
        Optional<List<Group>> groups = groupRepository.findAllByScheduleId(scheduleId);

        if(groups.isPresent()) {
            List<Group> teachingGroups = groups.get().stream()
                    .filter(Predicate.not(group -> group.getParent() == null || group.getParent().getParent() == null))
                    .collect(Collectors.toList());
            return new ResponseEntity<>(teachingGroups, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/schedule/{scheduleId}/groups")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Group>> getGroupsByScheduleId(@PathVariable Long scheduleId) {
        Optional<List<Group>> groups = groupRepository.findAllByScheduleId(scheduleId);

        return groups.map(groupList -> new ResponseEntity<>(groupList, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Group> getGroupById(@PathVariable Long id) {
        Optional<Group> group = groupRepository.findById(id);

        return group.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/parent/{parentId}/children")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Group>> getAllGroupsByParentId(@PathVariable Long parentId) {
        Optional<List<Group>> groups = groupRepository.findAllByParentId(parentId);

        return groups.map(groupList -> new ResponseEntity<>(groupList, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Group> createGroup(@RequestBody GroupRequest groupRequest) {
        Group group = new Group(
                groupRequest.getParent(),
                groupRequest.getGroupName(),
                groupRequest.getSchedule()
        );
        groupRepository.save(group);

        return new ResponseEntity<>(group, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Group> updateGroupInformation(@PathVariable Long id, @RequestBody Group group) {
        Optional<Group> foundGroup = groupRepository.findById(id);

        if(foundGroup.isPresent()) {
            Group newGroup = foundGroup.get();
            newGroup.setName(group.getName());
            newGroup.setSchedule(group.getSchedule());
            return new ResponseEntity<>(groupRepository.save(newGroup), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Group> deleteGroup(@PathVariable Long id) {
        Optional<Group> group = groupRepository.findById(id);
        if(group.isPresent()) {
            groupRepository.delete(group.get());
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}