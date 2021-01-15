package com.example.onlinescheduler.payload.schedule;

import com.example.onlinescheduler.models.schedule.*;
import com.example.onlinescheduler.models.schedule.cabinet.Cabinet;
import com.example.onlinescheduler.models.schedule.timeMangement.TimeSlot;

import javax.validation.constraints.NotBlank;
import java.util.Set;

public class TeachingHourRequest {
    @NotBlank
    private Subject subject;

    @NotBlank
    private Group group;

    @NotBlank
    private Teacher teacher;

    @NotBlank
    private Integer hoursPerWeek;

    @NotBlank
    private Boolean overAWeek;

    @NotBlank
    private Cabinet cabinet;

    @NotBlank
    private Set<TimeSlot> timeSlots;

    @NotBlank
    private Schedule schedule;

    public TeachingHourRequest() {}


    public TeachingHourRequest(@NotBlank Subject subject,
                               @NotBlank Group group,
                               @NotBlank Teacher teacher,
                               @NotBlank Integer hoursPerWeek,
                               @NotBlank Boolean overAWeek,
                               @NotBlank Cabinet cabinet,
                               @NotBlank Set<TimeSlot> timeSlots,
                               @NotBlank Schedule schedule) {
        this.subject = subject;
        this.group = group;
        this.teacher = teacher;
        this.hoursPerWeek = hoursPerWeek;
        this.overAWeek = overAWeek;
        this.cabinet = cabinet;
        this.timeSlots = timeSlots;
        this.schedule = schedule;
    }

    public Subject getSubject() { return subject; }

    public void setSubject(Subject subject) { this.subject = subject; }

    public Group getGroup() { return group; }

    public void setGroup(Group group) { this.group = group; }

    public Teacher getTeacher() { return teacher; }

    public void setTeacher(Teacher teacher) { this.teacher = teacher; }

    public Integer getHoursPerWeek() { return hoursPerWeek; }

    public void setHoursPerWeek(Integer hoursPerWeek) { this.hoursPerWeek = hoursPerWeek; }

    public Boolean getOverAWeek() { return overAWeek; }

    public void setOverAWeek(Boolean overAWeek) { this.overAWeek = overAWeek; }

    public Cabinet getCabinet() { return cabinet; }

    public void setCabinet(Cabinet cabinet) { this.cabinet = cabinet; }

    public Set<TimeSlot> getTimeSlots() { return timeSlots; }

    public void setTimeSlots(Set<TimeSlot> timeSlots) { this.timeSlots = timeSlots; }

    public Schedule getSchedule() { return schedule; }

    public void setSchedule(Schedule schedule) { this.schedule = schedule; }
}
