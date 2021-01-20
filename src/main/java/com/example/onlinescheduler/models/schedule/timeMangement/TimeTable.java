package com.example.onlinescheduler.models.schedule.timeMangement;

import com.example.onlinescheduler.models.schedule.Schedule;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "time_tables")
public class TimeTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @ManyToOne
    @JoinColumn(name = "schedule_id", referencedColumnName = "id")
    private Schedule schedule;

    @NotBlank
    @Size(max = 120)
    private String name;

    @OneToMany(mappedBy="timeTable", cascade = CascadeType.ALL)
    Set<TimeSlot> timeSlots = new HashSet<>();

    public TimeTable() {}

    public TimeTable(@NotBlank Schedule schedule, @NotBlank @Size(max = 120) String name) {
        this.schedule = schedule;
        this.name = name;
    }

    public Schedule getSchedule() { return schedule; }

    public void setSchedule(Schedule schedule) { this.schedule = schedule; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }
}
