package com.example.onlinescheduler.controllers.schedule;

import com.example.onlinescheduler.models.schedule.Hours;
import com.example.onlinescheduler.models.schedule.Subject;
import com.example.onlinescheduler.payload.HourRequest;
import com.example.onlinescheduler.repositories.schedule.HoursRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge =  3600)
@RestController
@RequestMapping("/api/hours")
public class HoursController {

    @Autowired
    HoursRepository hoursRepository;

    @GetMapping
    public ResponseEntity<List<Hours>> getAllHours() {
        List<Hours> allHours = hoursRepository.findAll();

        if(allHours.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(allHours, HttpStatus.FOUND);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hours> getHourById(@PathVariable Long id) {
       Optional<Hours> foundHour = hoursRepository.findById(id);

        return foundHour.map(hours -> new ResponseEntity<>(hours, HttpStatus.FOUND))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Hours> createHour(@RequestBody HourRequest hourRequest) {
        Hours newHour = new Hours(hourRequest.getSubject(), hourRequest.getCabinet(), hourRequest.getAmount());

        hoursRepository.save(newHour);

        return new ResponseEntity<>(newHour, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Hours> updateHourInformation(@PathVariable Long id, @RequestBody Hours hour) {
        Optional<Hours> foundHour = hoursRepository.findById(id);

        if(foundHour.isPresent()) {
            Hours newHour =  foundHour.get();
            newHour.setSubject(hour.getSubject());
            newHour.setCabinet(hour.getCabinet());
            newHour.setAmount(hour.getAmount());
            return new ResponseEntity<>(hoursRepository.save(newHour), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Hours> deleteHour(@PathVariable Long id) {
        Optional<Hours> hour = hoursRepository.findById(id);
        if(hour.isPresent()) {
            hoursRepository.delete(hour.get());
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
