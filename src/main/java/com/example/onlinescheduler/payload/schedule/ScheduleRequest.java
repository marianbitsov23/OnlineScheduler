package com.example.onlinescheduler.payload.schedule;

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

    public ScheduleRequest() {}

    public ScheduleRequest(@NotBlank String scheduleName, @NotBlank String description, @NotBlank User creator) {
        this.scheduleName = scheduleName;
        this.description = description;
        this.creator = creator;
    }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public String getScheduleName() { return scheduleName; }

    public void setScheduleName(String scheduleName) { this.scheduleName = scheduleName; }

    public User getCreator() { return creator; }

    public void setCreator(User creator) { this.creator = creator; }

}
