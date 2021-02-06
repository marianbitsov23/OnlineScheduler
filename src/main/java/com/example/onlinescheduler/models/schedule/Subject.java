package com.example.onlinescheduler.models.schedule;

import com.example.onlinescheduler.models.schedule.timeMangement.TimeSlot;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "subjects",
        uniqueConstraints = {
        @UniqueConstraint(columnNames = "name")
})
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 120)
    private String name;

    @NotBlank
    @ManyToOne
    @JoinColumn(name = "schedule_id", referencedColumnName = "id")
    private Schedule schedule;

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL)
    Set<TeachingHour> teachingHours = new HashSet<>();

    public Subject() {}

    public Subject(@NotBlank @Size(max = 120) String name, @NotBlank Schedule schedule) {
        this.name = name;
        this.schedule = schedule;
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public Schedule getSchedule() { return schedule; }

    public void setSchedule(Schedule schedule) { this.schedule = schedule; }
}
