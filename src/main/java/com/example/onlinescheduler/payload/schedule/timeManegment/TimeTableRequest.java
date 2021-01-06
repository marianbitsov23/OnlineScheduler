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

    private Set<TimeSlot> timeSlots;

    public TimeTableRequest() {}

    public TimeTableRequest(@NotBlank Schedule schedule, @NotBlank String timeTableName, Set<TimeSlot> timeSlots) {
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
