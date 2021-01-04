package com.example.onlinescheduler.payload.schedule;

import javax.validation.constraints.NotBlank;

public class CabinetRequest {
    @NotBlank
    private String cabinetName;

    @NotBlank
    private Boolean specialCabinet;

    public CabinetRequest() {}

    public CabinetRequest(@NotBlank String cabinetName, @NotBlank Boolean specialCabinet) {
        this.cabinetName = cabinetName;
        this.specialCabinet = specialCabinet;
    }


    public String getCabinetName() { return cabinetName; }

    public void setCabinetName(String cabinetName) { this.cabinetName = cabinetName; }

    public Boolean getSpecialCabinet() { return specialCabinet; }

    public void setSpecialCabinet(Boolean specialCabinet) { this.specialCabinet = specialCabinet; }
}
