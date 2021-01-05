package com.example.onlinescheduler.models.schedule;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "groups")
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private Group parent;

    @OneToMany(mappedBy = "parent")
    private Set<Group> children;

    public Group() {}

    public Group(Group parent, Set<Group> children) {
        this.parent = parent;
        this.children = children;
    }


    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Group getParent() { return parent; }

    public void setParent(Group parent) { this.parent = parent; }

    public Set<Group> getChildren() { return children; }

    public void setChildren(Set<Group> children) { this.children = children; }
}
