package com.example.onlinescheduler.payload.schedule.cabinet;

import com.example.onlinescheduler.models.schedule.Schedule;
import com.example.onlinescheduler.models.schedule.cabinet.CabinetCategory;

import javax.validation.constraints.NotBlank;
import java.util.Set;

public class CabinetRequest {
    @NotBlank
    private String name;

    @NotBlank
    Set<CabinetCategory> categories;

    @NotBlank
    private Schedule schedule;

    public CabinetRequest() {}

    public CabinetRequest(@NotBlank String name, @NotBlank Set<CabinetCategory> categories, @NotBlank Schedule schedule) {
        this.name = name;
        this.categories = categories;
        this.schedule = schedule;
    }

    public Schedule getSchedule() { return schedule; }

    public void setSchedule(Schedule schedule) { this.schedule = schedule; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public Set<CabinetCategory> getCategories() { return categories; }

    public void setSpecialCabinet(Set<CabinetCategory> categories) { this.categories = categories; }
}
