package com.example.onlinescheduler.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(name = "cabinets")
public class Cabinet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String cabinetName;

    @NotBlank
    private Boolean specialCabinet;

    public Cabinet() {}

    public Cabinet(@NotBlank @Size(max = 100) String cabinetName, @NotBlank Boolean specialCabinet) {
        this.cabinetName = cabinetName;
        this.specialCabinet = specialCabinet;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCabinetName() {
        return cabinetName;
    }

    public void setCabinetName(String cabinetName) {
        this.cabinetName = cabinetName;
    }

    public Boolean getSpecialCabinet() {
        return specialCabinet;
    }

    public void setSpecialCabinet(Boolean specialCabinet) {
        this.specialCabinet = specialCabinet;
    }
}
