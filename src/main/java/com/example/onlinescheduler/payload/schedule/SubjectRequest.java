package com.example.onlinescheduler.payload.schedule;

import com.example.onlinescheduler.models.schedule.Schedule;

import javax.validation.constraints.NotBlank;

public class SubjectRequest {
    @NotBlank
    private String name;

    @NotBlank
    private Schedule schedule;

    public SubjectRequest() {}

    public SubjectRequest(@NotBlank String name, @NotBlank Schedule schedule) {
        this.name = name;
        this.schedule = schedule;
    }

    public Schedule getSchedule() { return schedule; }

    public void setSchedule(Schedule schedule) { this.schedule = schedule; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }
}
