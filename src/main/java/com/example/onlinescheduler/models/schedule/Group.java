package com.example.onlinescheduler.models.schedule;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.Set;

@Entity
@Table(name = "schedule_groups")
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", referencedColumnName = "id")
    private Group parent;

    @NotBlank
    private String name;

    @OneToOne(mappedBy = "parentGroup")
    private Schedule schedule;

    @OneToMany(mappedBy = "parent")
    private Set<Group> children;

    public Group() {}

    public Group(Group parent, @NotBlank String name, Set<Group> children, Schedule schedule) {
        this.parent = parent;
        this.name = name;
        this.children = children;
        this.schedule = schedule;
    }

    public Group(Group parent, @NotBlank String name) {
        this.parent = parent;
        this.name = name;
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Long getParent() { return null; }

    public void setParent(Group parent) { this.parent = parent; }

    public Set<Group> getChildren() { return children; }

    public void setChildren(Set<Group> children) { this.children = children; }

    public Schedule getSchedule() { return null; }

    public void setSchedule(Schedule schedule) { this.schedule = schedule; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }
}
