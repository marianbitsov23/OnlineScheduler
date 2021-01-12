package com.example.onlinescheduler.payload.schedule;

import com.example.onlinescheduler.models.schedule.Group;
import com.example.onlinescheduler.models.schedule.Hours;
import com.example.onlinescheduler.models.user.User;

import javax.validation.constraints.NotBlank;
import java.util.Set;

public class ScheduleRequest {
    @NotBlank
    private String scheduleName;

    @NotBlank
    private String description;

    @NotBlank
    private User creator;

    @NotBlank
    private String groupName;

    public ScheduleRequest() {}

    public ScheduleRequest(@NotBlank String scheduleName, @NotBlank String description, @NotBlank User creator, @NotBlank String groupName) {
        this.scheduleName = scheduleName;
        this.description = description;
        this.creator = creator;
        this.groupName = groupName;
    }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public String getScheduleName() { return scheduleName; }

    public void setScheduleName(String scheduleName) { this.scheduleName = scheduleName; }

    public User getCreator() { return creator; }

    public void setCreator(User creator) { this.creator = creator; }

    public String getGroupName() { return groupName; }

    public void setGroupName(String groupName) { this.groupName = groupName; }
}
