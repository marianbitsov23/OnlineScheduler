package com.example.onlinescheduler.models.schedule.cabinet;

import com.example.onlinescheduler.models.schedule.Hours;
import com.example.onlinescheduler.models.schedule.Schedule;
import com.example.onlinescheduler.models.user.Role;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.HashSet;
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
    @ManyToOne
    @JoinColumn(name = "schedule_id", referencedColumnName = "id")
    private Schedule schedule;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "cabinet_categories",
            joinColumns = @JoinColumn(name = "cabinet_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id"))

    private Set<CabinetCategory> cabinetCategories = new HashSet<>();

    @OneToMany(mappedBy = "cabinet")
    private Set<Hours> hours;

    public Cabinet() {}

    public Cabinet(@NotBlank @Size(max = 100) String cabinetName, @NotBlank Schedule schedule) {
        this.cabinetName = cabinetName;
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

    public Schedule getSchedule() { return schedule; }

    public void setSchedule(Schedule schedule) { this.schedule = schedule; }

    public Set<CabinetCategory> getCabinetCategories() { return cabinetCategories; }

    public void setCabinetCategories(Set<CabinetCategory> cabinetCategories) { this.cabinetCategories = cabinetCategories; }
}
