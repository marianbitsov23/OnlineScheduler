package com.example.onlinescheduler.models.schedule;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "schedule_groups")
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    @ManyToOne
    @JoinColumn(name = "schedule_id", referencedColumnName = "id")
    private Schedule schedule;

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
    private Group parent;

    @OneToMany(mappedBy = "parent")
    private Set<Group> children;

    public Group() {}

    public Group(Group parent, @NotBlank String name, Schedule schedule) {
        this.parent = parent;
        this.name = name;
        this.schedule = schedule;
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Group getParent() { return this.parent; }

    public void setParent(Group parent) { this.parent = parent; }

    public Schedule getSchedule() { return null; }

    public void setSchedule(Schedule schedule) { this.schedule = schedule; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }
}
