package com.example.onlinescheduler.payload.schedule;

import com.example.onlinescheduler.models.schedule.Group;
import com.example.onlinescheduler.models.schedule.Schedule;

import javax.validation.constraints.NotBlank;
import java.util.Set;

public class GroupRequest {
    @NotBlank
    private Group parent;

    @NotBlank
    private String groupName;

    @NotBlank
    private Set<Group> children;

    @NotBlank
    private Schedule schedule;

    public GroupRequest() {}

    public GroupRequest(@NotBlank Group parent, @NotBlank String groupName, @NotBlank Set<Group> children, @NotBlank Schedule schedule) {
        this.parent = parent;
        this.groupName = groupName;
        this.children = children;
        this.schedule = schedule;
    }

    public Group getParent() { return parent; }

    public void setParent(Group parent) { this.parent = parent; }

    public Set<Group> getChildren() { return children; }

    public void setChildren(Set<Group> children) { this.children = children; }

    public Schedule getSchedule() { return schedule; }

    public void setSchedule(Schedule schedule) { this.schedule = schedule; }

    public String getGroupName() { return groupName; }

    public void setGroupName(String groupName) { this.groupName = groupName; }
}