package com.example.onlinescheduler.payload.schedule.timeManegment;

import com.example.onlinescheduler.models.schedule.timeMangement.TimeTable;
import com.example.onlinescheduler.models.schedule.timeMangement.WeekDay;

import javax.validation.constraints.NotBlank;
import java.util.Date;

public class TimeSlotRequest {
    @NotBlank
    private String weekDay;

    @NotBlank
    private String timeStart;

    @NotBlank
    private String timeEnd;

    public TimeSlotRequest() {}

    public TimeSlotRequest(@NotBlank String weekDay, @NotBlank String timeStart, @NotBlank String timeEnd) {
        this.weekDay = weekDay;
        this.timeStart = timeStart;
        this.timeEnd = timeEnd;
    }

    public String getWeekDay() { return weekDay; }

    public void setWeekDay(String weekDay) { this.weekDay = weekDay; }

    public String getTimeStart() { return timeStart; }

    public void setTimeStart(String timeStart) { this.timeStart = timeStart; }

    public String getTimeEnd() { return timeEnd; }

    public void setTimeEnd(String timeEnd) { this.timeEnd = timeEnd; }
}
