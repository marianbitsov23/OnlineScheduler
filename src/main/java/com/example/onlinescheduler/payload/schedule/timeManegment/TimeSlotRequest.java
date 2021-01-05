package com.example.onlinescheduler.payload.schedule.timeManegment;

import com.example.onlinescheduler.models.schedule.timeMangement.TimeTable;
import com.example.onlinescheduler.models.schedule.timeMangement.WeekDay;

import javax.validation.constraints.NotBlank;
import java.util.Date;

public class TimeSlotRequest {
    @NotBlank
    private WeekDay weekDay;

    @NotBlank
    private String timeStart;

    @NotBlank
    private String timeEnd;

    @NotBlank
    private TimeTable timeTable;

    public TimeSlotRequest() {}

    public TimeSlotRequest(@NotBlank WeekDay weekDay, @NotBlank String timeStart, @NotBlank String timeEnd, @NotBlank TimeTable timeTable) {
        this.weekDay = weekDay;
        this.timeStart = timeStart;
        this.timeEnd = timeEnd;
        this.timeTable = timeTable;
    }

    public WeekDay getWeekDay() { return weekDay; }

    public void setWeekDay(WeekDay weekDay) { this.weekDay = weekDay; }

    public String getTimeStart() { return timeStart; }

    public void setTimeStart(String timeStart) { this.timeStart = timeStart; }

    public String getTimeEnd() { return timeEnd; }

    public void setTimeEnd(String timeEnd) { this.timeEnd = timeEnd; }

    public TimeTable getTimeTable() { return timeTable; }

    public void setTimeTable(TimeTable timeTable) { this.timeTable = timeTable; }
}
