package com.example.onlinescheduler.controllers.schedule;

import com.example.onlinescheduler.models.schedule.Group;
import com.example.onlinescheduler.payload.schedule.GroupRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
/*
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

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Group> getGroupById(@PathVariable Long id) {
        Optional<Group> foundGroup = groupRepository.findById(id);

        return foundGroup.map(group -> new ResponseEntity<>(group, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Group> createGroup(@RequestBody GroupRequest groupRequest) {
        Group group = new Group(groupRequest.getParent(), groupRequest.getChildren());
        groupRepository.save(group);

        return new ResponseEntity<>(group, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Group> updateGroupInformation(@PathVariable Long id, @RequestBody Group group) {
        Optional<Group> foundGroup = groupRepository.findById(id);

        if(foundGroup.isPresent()) {
            Group newGroup = foundGroup.get();
            newGroup.setChildren(group.getChildren());
            newGroup.setParent(group.getParent());
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


 */