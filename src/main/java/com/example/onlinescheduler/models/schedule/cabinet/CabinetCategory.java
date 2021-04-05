package com.example.onlinescheduler.models.schedule.cabinet;

import com.example.onlinescheduler.models.schedule.Schedule;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.Set;

@Entity
@Table(name = "categories")
public class CabinetCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 40)
    private String name;

    @NotBlank
    @ManyToOne
    @JoinColumn(name = "schedule_id", referencedColumnName = "id")
    private Schedule schedule;

    @ManyToMany(mappedBy = "cabinetCategories", cascade = CascadeType.ALL)
    Set<Cabinet> cabinets;

    public CabinetCategory() {}

    public CabinetCategory(String name, @NotBlank Schedule schedule) {
        this.name = name;
        this.schedule = schedule;
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
}
