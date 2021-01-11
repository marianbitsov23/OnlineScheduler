package com.example.onlinescheduler.models.schedule;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Set;

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

    @NotBlank
    @ManyToOne
    @JoinColumn(name = "schedule_id", referencedColumnName = "id")
    private Schedule schedule;

    @OneToMany(mappedBy = "cabinet")
    private Set<Hours> hours;

    public Cabinet() {}

    public Cabinet(@NotBlank @Size(max = 100) String cabinetName, @NotBlank Boolean specialCabinet, @NotBlank Schedule schedule) {
        this.cabinetName = cabinetName;
        this.specialCabinet = specialCabinet;
        this.schedule = schedule;
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
