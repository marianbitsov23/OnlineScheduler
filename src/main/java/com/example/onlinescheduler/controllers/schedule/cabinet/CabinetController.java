package com.example.onlinescheduler.controllers.schedule.cabinet;

import com.example.onlinescheduler.models.schedule.Group;
import com.example.onlinescheduler.models.schedule.Schedule;
import com.example.onlinescheduler.models.schedule.Teacher;
import com.example.onlinescheduler.models.schedule.cabinet.Cabinet;
import com.example.onlinescheduler.models.schedule.cabinet.CabinetCategory;
import com.example.onlinescheduler.payload.schedule.cabinet.CabinetRequest;
import com.example.onlinescheduler.repositories.schedule.cabinet.CabinetCategoryRepository;
import com.example.onlinescheduler.repositories.schedule.cabinet.CabinetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "*", maxAge =  3600)
@RestController
@RequestMapping("/api/public/cabinet")
public class CabinetController {
    @Autowired
    CabinetRepository cabinetRepository;

    @Autowired
    CabinetCategoryRepository cabinetCategoryRepository;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Cabinet> createCabinet(@RequestBody CabinetRequest cabinetRequest) {
        Cabinet cabinet = new Cabinet(
                cabinetRequest.getName(),
                cabinetRequest.getSchedule(),
                cabinetRequest.getCategories()
        );
        cabinetRepository.save(cabinet);

        return new ResponseEntity<>(cabinet, HttpStatus.CREATED);
    }

    @PostMapping("/copy/{oldScheduleId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> copyCabinetsFromSchedule(@PathVariable Long oldScheduleId, @RequestBody Schedule newSchedule) {
        Optional<List<Cabinet>> cabinets = cabinetRepository.findAllCabinetsByScheduleId(oldScheduleId);
        Optional<List<CabinetCategory>> cabinetCategories = cabinetCategoryRepository.findAllCabinetCategoriesByScheduleId(oldScheduleId);

        if(cabinets.isPresent() && cabinetCategories.isPresent()) {
            Set<CabinetCategory> newCabinetCategories = new HashSet<>(cabinetCategoryRepository.findAllBySchedule(null).get());

            for(CabinetCategory cc : cabinetCategories.get()) {
                CabinetCategory newCabinetCategory = new CabinetCategory(cc.getName(), newSchedule);
                cabinetCategoryRepository.save(newCabinetCategory);
                newCabinetCategories.add(newCabinetCategory);
            }

            for(Cabinet cabinet : cabinets.get()) {
                Set<CabinetCategory> finalCabinetCategories = new HashSet<>();
                for(CabinetCategory ccc : cabinet.getCabinetCategories()) {
                    for(CabinetCategory ncc : newCabinetCategories) {
                        if(ncc.getName().equals(ccc.getName())) finalCabinetCategories.add(ncc);
                    }
                }

                Cabinet newCabinet = new Cabinet(
                        cabinet.getName(),
                        newSchedule,
                        finalCabinetCategories
                );

                cabinetRepository.save(newCabinet);
            }
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/schedule/{scheduleId}/cabinets")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Cabinet>> getCabinetsByScheduleId(@PathVariable Long scheduleId) {
        Optional<List<Cabinet>> cabinets = cabinetRepository.findAllCabinetsByScheduleId(scheduleId);

        return cabinets.map(cabinetList -> new ResponseEntity<>(cabinetList, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Cabinet>> getAllCabinets() {
        List<Cabinet> cabinets = cabinetRepository.findAll();

        if(cabinets.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(cabinets, HttpStatus.OK);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Cabinet> getCabinetById(@PathVariable Long id) {
        Optional<Cabinet> cabinet = cabinetRepository.findById(id);

        return cabinet.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Cabinet> updateCabinetInformation(@PathVariable Long id, @RequestBody Cabinet cabinet) {
        Optional<Cabinet> foundCabinet = cabinetRepository.findById(id);

        if(foundCabinet.isPresent()) {
            Cabinet newCabinet = foundCabinet.get();
            newCabinet.setName(cabinet.getName());
            newCabinet.setCabinetCategories(cabinet.getCabinetCategories());
            return new ResponseEntity<>(cabinetRepository.save(newCabinet), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Cabinet> deleteCabinet(@PathVariable Long id) {
        Optional<Cabinet> cabinet = cabinetRepository.findById(id);
        if (cabinet.isPresent()) {
            cabinetRepository.delete(cabinet.get());
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
