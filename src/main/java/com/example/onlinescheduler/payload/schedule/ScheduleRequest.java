package com.example.onlinescheduler.payload.schedule;

import com.example.onlinescheduler.models.schedule.Group;
import com.example.onlinescheduler.models.user.User;

import javax.validation.constraints.NotBlank;
import java.util.Set;

public class ScheduleRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String description;

    @NotBlank
    private User creator;

    @NotBlank
    private String groupName;

    public ScheduleRequest() {}

    public ScheduleRequest(@NotBlank String name, @NotBlank String description, @NotBlank User creator, @NotBlank String groupName) {
        this.name = name;
        this.description = description;
        this.creator = creator;
        this.groupName = groupName;
    }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public User getCreator() { return creator; }

    public void setCreator(User creator) { this.creator = creator; }

    public String getGroupName() { return groupName; }

    public void setGroupName(String groupName) { this.groupName = groupName; }
}
