package com.example.onlinescheduler.controller;

import com.example.onlinescheduler.model.schedule.Cabinet;
import com.example.onlinescheduler.model.user.User;
import com.example.onlinescheduler.repository.CabinetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge =  3600)
@RestController
@RequestMapping("/api/auth/cabinet")
public class CabinetController {

    @Autowired
    CabinetRepository cabinetRepository;

    @PostMapping
    public ResponseEntity<Cabinet> createCabinet(String cabinetName, Boolean specialCabinet) {
        Cabinet cabinet = new Cabinet(cabinetName, specialCabinet);
        cabinetRepository.save(cabinet);

        return new ResponseEntity<>(cabinet, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Cabinet>> getAllCabinets() {
        List<Cabinet> cabinets = cabinetRepository.findAll();

        if(cabinets.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(cabinets, HttpStatus.FOUND);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cabinet> getCabinetById(@PathVariable Long id) {
        Optional<Cabinet> cabinet = cabinetRepository.findById(id);

        return cabinet.map(value -> new ResponseEntity<>(value, HttpStatus.FOUND))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cabinet> updateCabinetInformation(@PathVariable Long id, @RequestBody Cabinet cabinet) {
        Optional<Cabinet> foundCabinet = cabinetRepository.findById(id);

        if(foundCabinet.isPresent()) {
            Cabinet newCabinet = foundCabinet.get();
            newCabinet.setCabinetName(cabinet.getCabinetName());
            newCabinet.setSpecialCabinet(cabinet.getSpecialCabinet());
            return new ResponseEntity<>(cabinetRepository.save(newCabinet), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
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
