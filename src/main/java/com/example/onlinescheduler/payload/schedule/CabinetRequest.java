package com.example.onlinescheduler.payload.schedule;

import com.example.onlinescheduler.models.schedule.Schedule;

import javax.validation.constraints.NotBlank;

public class CabinetRequest {
    @NotBlank
    private String cabinetName;

    @NotBlank
    private Boolean specialCabinet;

    @NotBlank
    private Schedule schedule;

    public CabinetRequest() {}

    public CabinetRequest(@NotBlank String cabinetName, @NotBlank Boolean specialCabinet, @NotBlank Schedule schedule) {
        this.cabinetName = cabinetName;
        this.specialCabinet = specialCabinet;
        this.schedule = schedule;
    }

    public Schedule getSchedule() { return schedule; }

    public void setSchedule(Schedule schedule) { this.schedule = schedule; }

    public String getCabinetName() { return cabinetName; }

    public void setCabinetName(String cabinetName) { this.cabinetName = cabinetName; }

    public Boolean getSpecialCabinet() { return specialCabinet; }

    public void setSpecialCabinet(Boolean specialCabinet) { this.specialCabinet = specialCabinet; }
}
