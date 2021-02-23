package com.example.onlinescheduler.payload.schedule.timeManegment;

import com.example.onlinescheduler.models.schedule.Schedule;
import com.example.onlinescheduler.models.schedule.timeMangement.TimeSlot;

import javax.validation.constraints.NotBlank;
import java.util.Set;

public class TimeTableRequest {
    @NotBlank
    private Schedule schedule;

    @NotBlank
    private String name;

    public TimeTableRequest() {}

    public TimeTableRequest(@NotBlank Schedule schedule, @NotBlank String name) {
        this.schedule = schedule;
        this.name = name;
    }

    public Schedule getSchedule() { return schedule; }

    public void setSchedule(Schedule schedule) { this.schedule = schedule; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }
}
