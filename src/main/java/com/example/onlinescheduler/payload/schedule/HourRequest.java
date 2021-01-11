package com.example.onlinescheduler.payload.schedule;

import com.example.onlinescheduler.models.schedule.Cabinet;
import com.example.onlinescheduler.models.schedule.Schedule;
import com.example.onlinescheduler.models.schedule.Subject;

import javax.validation.constraints.NotBlank;

public class HourRequest {

    @NotBlank
    private Subject subject;

    @NotBlank
    private Cabinet cabinet;

    @NotBlank
    private Integer amount;

    @NotBlank
    private Schedule schedule;

    public HourRequest(@NotBlank Subject subject, @NotBlank Cabinet cabinet, @NotBlank Integer amount, @NotBlank Schedule schedule) {
        this.subject = subject;
        this.cabinet = cabinet;
        this.amount = amount;
        this.schedule = schedule;
    }

    public Schedule getSchedule() { return schedule; }

    public void setSchedule(Schedule schedule) { this.schedule = schedule; }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public Cabinet getCabinet() {
        return cabinet;
    }

    public void setCabinet(Cabinet cabinet) {
        this.cabinet = cabinet;
    }

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }
}
