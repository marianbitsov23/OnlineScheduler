package com.example.onlinescheduler.payload.schedule.timeManegment;

import com.example.onlinescheduler.models.schedule.Schedule;
import com.example.onlinescheduler.models.schedule.timeMangement.TimeSlot;

import javax.validation.constraints.NotBlank;
import java.util.Set;

public class TimeTableRequest {
    @NotBlank
    private Schedule schedule;

    @NotBlank
    private String timeTableName;

    public TimeTableRequest() {}

    public TimeTableRequest(@NotBlank Schedule schedule, @NotBlank String timeTableName) {
        this.schedule = schedule;
        this.timeTableName = timeTableName;
    }

    public Schedule getSchedule() { return schedule; }

    public void setSchedule(Schedule schedule) { this.schedule = schedule; }

    public String getTimeTableName() { return timeTableName; }

    public void setTimeTableName(String timeTableName) { this.timeTableName = timeTableName; }
}
