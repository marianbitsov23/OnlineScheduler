package com.example.onlinescheduler.controller;

import com.example.onlinescheduler.model.schedule.Cabinet;
import com.example.onlinescheduler.repository.CabinetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge =  3600)
@RestController
@RequestMapping("/api/cabinet")
public class CabinetController {

    @Autowired
    CabinetRepository cabinetRepository;

    @PostMapping
    public ResponseEntity<Cabinet> createCabinet(String cabinetName, Boolean specialCabinet) {
        Cabinet cabinet = new Cabinet(cabinetName, specialCabinet);
        cabinetRepository.save(cabinet);

        return new ResponseEntity<>(cabinet, HttpStatus.CREATED);
    }

}
