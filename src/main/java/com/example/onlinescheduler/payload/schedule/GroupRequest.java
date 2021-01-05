package com.example.onlinescheduler.payload.schedule;

import com.example.onlinescheduler.models.schedule.Group;

import javax.validation.constraints.NotBlank;
import java.util.Set;

public class GroupRequest {
    @NotBlank
    private Group parent;

    @NotBlank
    private Set<Group> children;

    public GroupRequest() {}

    public GroupRequest(@NotBlank Group parent, @NotBlank Set<Group> children) {
        this.parent = parent;
        this.children = children;
    }

    public Group getParent() { return parent; }

    public void setParent(Group parent) { this.parent = parent; }

    public Set<Group> getChildren() { return children; }

    public void setChildren(Set<Group> children) { this.children = children; }
}