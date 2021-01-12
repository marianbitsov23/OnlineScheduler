package com.example.onlinescheduler.payload.schedule;

import com.example.onlinescheduler.models.schedule.Schedule;

import javax.validation.constraints.NotBlank;
import java.util.Set;

public class CabinetRequest {
    @NotBlank
    private String cabinetName;

    @NotBlank
    Set<String> categories;

    @NotBlank
    private Schedule schedule;

    public CabinetRequest() {}

    public CabinetRequest(@NotBlank String cabinetName, @NotBlank Set<String> categories, @NotBlank Schedule schedule) {
        this.cabinetName = cabinetName;
        this.categories = categories;
        this.schedule = schedule;
    }

    public Schedule getSchedule() { return schedule; }

    public void setSchedule(Schedule schedule) { this.schedule = schedule; }

    public String getCabinetName() { return cabinetName; }

    public void setCabinetName(String cabinetName) { this.cabinetName = cabinetName; }

    public Set<String> getCategories() { return categories; }

    public void setSpecialCabinet(Set<String> categories) { this.categories = categories; }
}
