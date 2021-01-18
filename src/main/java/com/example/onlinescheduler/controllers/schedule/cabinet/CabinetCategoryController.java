package com.example.onlinescheduler.controllers.schedule.cabinet;

import com.example.onlinescheduler.models.schedule.cabinet.CabinetCategory;
import com.example.onlinescheduler.payload.schedule.cabinet.CabinetCategoryRequest;
import com.example.onlinescheduler.repositories.schedule.cabinet.CabinetCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge =  3600)
@RestController
@RequestMapping("/api/public/cabinet-category")
public class CabinetCategoryController {
    @Autowired
    CabinetCategoryRepository cabinetCategoryRepository;

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<CabinetCategory>> getAllCabinets() {
        List<CabinetCategory> cabinetCategories = cabinetCategoryRepository.findAll();

        if(cabinetCategories.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(cabinetCategories, HttpStatus.OK);
        }
    }

    @GetMapping("/default")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<CabinetCategory>> getDefaultCabinetCategories() {
        Optional<List<CabinetCategory>> cabinetCategories = cabinetCategoryRepository.findAllBySchedule(null);

        return cabinetCategories.map(cabinetCategoryList -> new ResponseEntity<>(cabinetCategoryList, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/schedule/{scheduleId}/categories")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<CabinetCategory>> getCabinetsByScheduleId(@PathVariable Long scheduleId) {
        Optional<List<CabinetCategory>> cabinetCategories = cabinetCategoryRepository.findAllCabinetCategoriesByScheduleId(scheduleId);

        return cabinetCategories.map(cabinetCategoryList -> new ResponseEntity<>(cabinetCategoryList, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<CabinetCategory> getCabinetCategoryById(@PathVariable Long id) {
        Optional<CabinetCategory> cabinetCategory = cabinetCategoryRepository.findById(id);

        return cabinetCategory.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<CabinetCategory> createCabinetCategory(@RequestBody CabinetCategoryRequest cabinetCategoryRequest) {
        CabinetCategory cabinetCategory = new CabinetCategory(cabinetCategoryRequest.getName(), cabinetCategoryRequest.getSchedule());
        cabinetCategoryRepository.save(cabinetCategory);

        return new ResponseEntity<>(cabinetCategory, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<CabinetCategory> updateCabinetCategoryInformation(@PathVariable Long id, @RequestBody CabinetCategory cabinetCategory) {
        Optional<CabinetCategory> foundCabinetCategory = cabinetCategoryRepository.findById(id);

        if(foundCabinetCategory.isPresent()) {
            CabinetCategory newCabinetCategory = foundCabinetCategory.get();
            newCabinetCategory.setName(cabinetCategory.getName());
            return new ResponseEntity<>(cabinetCategoryRepository.save(newCabinetCategory), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<CabinetCategory> deleteCabinetCategory(@PathVariable Long id) {
        Optional<CabinetCategory> cabinetCategory = cabinetCategoryRepository.findById(id);
        if (cabinetCategory.isPresent()) {
            cabinetCategoryRepository.delete(cabinetCategory.get());
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
