package com.example.onlinescheduler.models.schedule.cabinet;

import javax.persistence.*;

@Entity
@Table(name = "categories")
public class CabinetCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 40)
    private String name;

    public CabinetCategory() {}

    public CabinetCategory(String name) {
        this.name = name;
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
}
