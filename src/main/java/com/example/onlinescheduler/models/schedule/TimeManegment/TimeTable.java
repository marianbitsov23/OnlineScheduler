package com.example.onlinescheduler.models.schedule.TimeManegment;

import com.example.onlinescheduler.models.schedule.Schedule;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
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

    @OneToMany(mappedBy = "timeTable")
    private Set<TimeSlot> timeSlots;

    public TimeTable() {}

    public TimeTable(@NotBlank Schedule schedule, @NotBlank @Size(max = 120) String timeTableName, Set<TimeSlot> timeSlots) {
        this.schedule = schedule;
        this.timeTableName = timeTableName;
        this.timeSlots = timeSlots;
    }
    

    public Schedule getSchedule() { return schedule; }

    public void setSchedule(Schedule schedule) { this.schedule = schedule; }

    public String getTimeTableName() { return timeTableName; }

    public void setTimeTableName(String timeTableName) { this.timeTableName = timeTableName; }

    public Set<TimeSlot> getTimeSlots() { return timeSlots; }

    public void setTimeSlots(Set<TimeSlot> timeSlots) { this.timeSlots = timeSlots; }
}
