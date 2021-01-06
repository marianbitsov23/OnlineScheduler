package com.example.onlinescheduler.models.schedule.timeMangement;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.time.LocalTime;
import java.util.Date;

@Entity
@Table(name = "time_slots")
public class TimeSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private WeekDay weekDay;

    @Column(name = "timeStart")
    private String timeStart;

    @Column(name = "timeEnd")
    private String timeEnd;

    @ManyToOne
    @JoinColumn(name = "time_table_id", referencedColumnName = "id")
    private TimeTable timeTable;

    public TimeSlot() {}

    public TimeSlot(@NotBlank WeekDay weekDay, @NotBlank String timeStart, @NotBlank String timeEnd, TimeTable timeTable) {
        this.weekDay = weekDay;
        this.timeStart = timeStart;
        this.timeEnd = timeEnd;
        this.timeTable = timeTable;
    }

    public TimeSlot(@NotBlank WeekDay weekDay, @NotBlank String timeStart, @NotBlank String timeEnd) {
        this.weekDay = weekDay;
        this.timeStart = timeStart;
        this.timeEnd = timeEnd;
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public WeekDay getWeekDay() { return weekDay; }

    public void setWeekDay(WeekDay weekDay) { this.weekDay = weekDay; }

    public @NotBlank String getTimeStart() { return timeStart; }

    public void setTimeStart(String timeStart) { this.timeStart = timeStart; }

    public @NotBlank String getTimeEnd() { return timeEnd; }

    public void setTimeEnd(String timeEnd) { this.timeEnd = timeEnd; }

    public TimeTable getTimeTable() { return timeTable; }

    public void setTimeTable(TimeTable timeTable) { this.timeTable = timeTable; }
}
