package com.example.onlinescheduler.models.schedule;

import com.example.onlinescheduler.models.schedule.timeMangement.TimeTable;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "lessons")
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String name;

    @NotBlank
    @ManyToOne
    @JoinColumn(name = "time_table_id", referencedColumnName = "id")
    private TimeTable timeTable;

    @NotBlank
    @ManyToOne
    @JoinColumn(name = "schedule_id", referencedColumnName = "id")
    private Schedule schedule;

    @NotBlank
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "lesson_slots",
            joinColumns = @JoinColumn(name = "lesson_id"),
            inverseJoinColumns = @JoinColumn(name = "teachingHour_id"))

    private Set<TeachingHour> teachingHours = new HashSet<>();

    public Lesson() {}

    public Lesson(@NotBlank @Size(max = 100) String name,
                  @NotBlank TimeTable timeTable,
                  @NotBlank Schedule schedule,
                  @NotBlank Set<TeachingHour> teachingHours) {
        this.name = name;
        this.timeTable = timeTable;
        this.schedule = schedule;
        this.teachingHours = teachingHours;
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public TimeTable getTimeTable() { return timeTable; }

    public void setTimeTable(TimeTable timeTable) { this.timeTable = timeTable; }

    public Schedule getSchedule() { return schedule; }

    public void setSchedule(Schedule schedule) { this.schedule = schedule; }

    public Set<TeachingHour> getTeachingHours() { return teachingHours; }

    public void setTeachingHours(Set<TeachingHour> teachingHours) { this.teachingHours = teachingHours; }
}
