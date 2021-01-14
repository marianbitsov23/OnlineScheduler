package com.example.onlinescheduler.payload.schedule.cabinet;

import com.example.onlinescheduler.models.schedule.Schedule;

import javax.validation.constraints.NotBlank;

public class CabinetCategoryRequest {
    @NotBlank
    private String name;

    @NotBlank
    private Schedule schedule;

    public CabinetCategoryRequest() {}

    public CabinetCategoryRequest(@NotBlank String name, @NotBlank Schedule schedule) {
        this.name = name;
        this.schedule = schedule;
    }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public Schedule getSchedule() { return schedule; }

    public void setSchedule(Schedule schedule) { this.schedule = schedule; }
}
