package com.example.onlinescheduler.payload.schedule;

import com.example.onlinescheduler.models.schedule.Schedule;
import com.example.onlinescheduler.models.schedule.Subject;

import javax.validation.constraints.NotBlank;
import java.util.Set;

public class TeacherRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String initials;

    @NotBlank
    private Schedule schedule;

    public TeacherRequest() {}

    public TeacherRequest(@NotBlank String name, @NotBlank String initials, @NotBlank Schedule schedule) {
        this.name = name;
        this.schedule = schedule;
    }

    public Schedule getSchedule() { return schedule; }

    public void setSchedule(Schedule schedule) { this.schedule = schedule; }
    public String getInitials() { return initials; }

    public void setInitials(String initials) { this.initials = initials; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }
}
