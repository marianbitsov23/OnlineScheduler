package com.example.onlinescheduler.models.schedule.cabinet;

import javax.persistence.*;

@Entity
@Table(name = "categories")
public class CabinetCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ECabinetCategory name;

    public CabinetCategory() {}

    public CabinetCategory(ECabinetCategory name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ECabinetCategory getName() {
        return name;
    }

    public void setName(ECabinetCategory name) {
        this.name = name;
    }
}
