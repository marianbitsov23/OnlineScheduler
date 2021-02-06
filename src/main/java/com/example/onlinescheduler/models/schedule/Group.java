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

    @OneToMany
    @OrderColumn
    @JoinColumn(name = "parent_id")
    private List<Group> children = new LinkedList<Group>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", insertable = false, updatable = false)
    private Group parent;

    public Group() {}

    public Group(Group parent, @NotBlank String name, List<Group> children, Schedule schedule) {
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

    public List<Group> getChildren() { return children; }

    public void setChildren(List<Group> children) { this.children = children; }

    public Schedule getSchedule() { return null; }

    public void setSchedule(Schedule schedule) { this.schedule = schedule; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }
}
