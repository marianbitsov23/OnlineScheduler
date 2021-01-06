package com.example.onlinescheduler.models.schedule.timeMangement;

import com.example.onlinescheduler.models.schedule.Schedule;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
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

    @NotBlank
    @Temporal(TemporalType.TIME)
    private Date timeStart;

    @NotBlank
    @Temporal(TemporalType.TIME)
    private Date timeEnd;

    @ManyToOne
    @JoinColumn(name = "time_table_id", referencedColumnName = "id")
    private TimeTable timeTable;

    public TimeSlot() {}

    public TimeSlot(@NotBlank WeekDay weekDay, @NotBlank Date timeStart, @NotBlank Date timeEnd, TimeTable timeTable) {
        this.weekDay = weekDay;
        this.timeStart = timeStart;
        this.timeEnd = timeEnd;
        this.timeTable = timeTable;
    }

    public TimeSlot(@NotBlank WeekDay weekDay, @NotBlank Date timeStart, @NotBlank Date timeEnd) {
        this.weekDay = weekDay;
        this.timeStart = timeStart;
        this.timeEnd = timeEnd;
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public WeekDay getWeekDay() { return weekDay; }

    public void setWeekDay(WeekDay weekDay) { this.weekDay = weekDay; }

    public Date getTimeStart() { return timeStart; }

    public void setTimeStart(Date timeStart) { this.timeStart = timeStart; }

    public Date getTimeEnd() { return timeEnd; }

    public void setTimeEnd(Date timeEnd) { this.timeEnd = timeEnd; }

    public TimeTable getTimeTable() { return timeTable; }

    public void setTimeTable(TimeTable timeTable) { this.timeTable = timeTable; }
}
