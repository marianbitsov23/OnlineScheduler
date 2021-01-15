package com.example.onlinescheduler.models.schedule.cabinet;

import com.example.onlinescheduler.models.schedule.Schedule;
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
    private String name;

    @NotBlank
    @ManyToOne
    @JoinColumn(name = "schedule_id", referencedColumnName = "id")
    private Schedule schedule;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "cabinet_categories",
            joinColumns = @JoinColumn(name = "cabinet_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id"))

    private Set<CabinetCategory> cabinetCategories = new HashSet<>();

    public Cabinet() {}

    public Cabinet(@NotBlank @Size(max = 100) String name, @NotBlank Schedule schedule, Set<CabinetCategory> cabinetCategories) {
        this.name = name;
        this.schedule = schedule;
        this.cabinetCategories = cabinetCategories;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Schedule getSchedule() { return schedule; }

    public void setSchedule(Schedule schedule) { this.schedule = schedule; }

    public Set<CabinetCategory> getCabinetCategories() { return cabinetCategories; }

    public void setCabinetCategories(Set<CabinetCategory> cabinetCategories) { this.cabinetCategories = cabinetCategories; }
}
