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

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "parent_id", referencedColumnName = "id")
    private Group parent;

    @NotBlank
    private String groupName;

    @OneToOne(mappedBy = "parentGroup")
    private Schedule schedule;

    @OneToMany(mappedBy = "parent")
    private Set<Group> children;

    public Group() {}

    public Group(Group parent, @NotBlank String groupName, Set<Group> children, Schedule schedule) {
        this.parent = parent;
        this.groupName = groupName;
        this.children = children;
        this.schedule = schedule;
    }


    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Group getParent() { return parent; }

    public void setParent(Group parent) { this.parent = parent; }

    public Set<Group> getChildren() { return children; }

    public void setChildren(Set<Group> children) { this.children = children; }

    public Schedule getSchedule() { return schedule; }

    public void setSchedule(Schedule schedule) { this.schedule = schedule; }

    public String getGroupName() { return groupName; }

    public void setGroupName(String groupName) { this.groupName = groupName; }
}
