package com.example.onlinescheduler.controllers.schedule;

import com.example.onlinescheduler.models.schedule.Cabinet;
import com.example.onlinescheduler.payload.schedule.CabinetRequest;
import com.example.onlinescheduler.repositories.schedule.CabinetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge =  3600)
@RestController
@RequestMapping("/api/public/cabinet")
public class CabinetController {

    @Autowired
    CabinetRepository cabinetRepository;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Cabinet> createCabinet(@RequestBody CabinetRequest cabinetRequest) {
        Cabinet cabinet = new Cabinet(cabinetRequest.getCabinetName(), cabinetRequest.getSpecialCabinet());
        cabinetRepository.save(cabinet);

        return new ResponseEntity<>(cabinet, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Cabinet>> getAllCabinets() {
        List<Cabinet> cabinets = cabinetRepository.findAll();

        if(cabinets.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(cabinets, HttpStatus.FOUND);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Cabinet> getCabinetById(@PathVariable Long id) {
        Optional<Cabinet> cabinet = cabinetRepository.findById(id);

        return cabinet.map(value -> new ResponseEntity<>(value, HttpStatus.FOUND))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
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
