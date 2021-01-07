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
    private String timeTableName;

    public TimeTable() {}

    public TimeTable(@NotBlank Schedule schedule, @NotBlank @Size(max = 120) String timeTableName) {
        this.schedule = schedule;
        this.timeTableName = timeTableName;
    }

    public Schedule getSchedule() { return schedule; }

    public void setSchedule(Schedule schedule) { this.schedule = schedule; }

    public String getTimeTableName() { return timeTableName; }

    public void setTimeTableName(String timeTableName) { this.timeTableName = timeTableName; }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }
}
