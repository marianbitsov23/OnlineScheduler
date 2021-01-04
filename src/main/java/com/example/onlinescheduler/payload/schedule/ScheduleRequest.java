package com.example.onlinescheduler.payload.schedule;

import com.example.onlinescheduler.models.schedule.Hours;
import com.example.onlinescheduler.models.user.User;

import javax.validation.constraints.NotBlank;
import java.util.Set;

public class ScheduleRequest {
    @NotBlank
    private String scheduleName;

    @NotBlank
    private Integer session;

    @NotBlank
    private User creator;

    @NotBlank
    private Set<Hours> hours;

    public ScheduleRequest() {}

    public ScheduleRequest(@NotBlank String scheduleName, @NotBlank Integer session, @NotBlank User creator, @NotBlank Set<Hours> hours) {
        this.scheduleName = scheduleName;
        this.session = session;
        this.creator = creator;
        this.hours = hours;
    }


    public String getScheduleName() { return scheduleName; }

    public void setScheduleName(String scheduleName) { this.scheduleName = scheduleName; }

    public Integer getSession() { return session; }

    public void setSession(Integer session) { this.session = session; }

    public User getCreator() { return creator; }

    public void setCreator(User creator) { this.creator = creator; }

    public Set<Hours> getHours() { return hours; }

    public void setHours(Set<Hours> hours) { this.hours = hours; }
}
