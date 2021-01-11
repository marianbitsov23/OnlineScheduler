package com.example.onlinescheduler.payload.schedule;

import com.example.onlinescheduler.models.schedule.Schedule;

import javax.validation.constraints.NotBlank;

public class SubjectRequest {
    @NotBlank
    private String subjectName;

    @NotBlank
    private Schedule schedule;

    public SubjectRequest() {}

    public SubjectRequest(@NotBlank String subjectName, @NotBlank Schedule schedule) {
        this.subjectName = subjectName;
        this.schedule = schedule;
    }

    public Schedule getSchedule() { return schedule; }

    public void setSchedule(Schedule schedule) { this.schedule = schedule; }

    public String getSubjectName() { return subjectName; }

    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
}
