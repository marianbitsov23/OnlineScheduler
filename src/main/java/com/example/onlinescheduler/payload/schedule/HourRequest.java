package com.example.onlinescheduler.payload.schedule;

import com.example.onlinescheduler.models.schedule.Cabinet;
import com.example.onlinescheduler.models.schedule.Subject;

import javax.validation.constraints.NotBlank;

public class HourRequest {

    @NotBlank
    private Subject subject;

    @NotBlank
    private Cabinet cabinet;

    @NotBlank
    private Integer amount;

    public HourRequest(@NotBlank Subject subject, @NotBlank Cabinet cabinet, @NotBlank Integer amount) {
        this.subject = subject;
        this.cabinet = cabinet;
        this.amount = amount;
    }


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
