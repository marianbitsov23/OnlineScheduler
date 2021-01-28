package com.example.onlinescheduler.payload.schedule;

import com.example.onlinescheduler.models.schedule.Schedule;
import com.example.onlinescheduler.models.schedule.TeachingHour;
import com.example.onlinescheduler.models.schedule.timeMangement.TimeTable;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

public class LessonRequest {
    @NotBlank
    private String name;

    @NotBlank
    private TimeTable timeTable;

    @NotBlank
    private Schedule schedule;

    @NotBlank
    private Set<TeachingHour> teachingHours = new HashSet<>();

    public LessonRequest() {}
    public LessonRequest(@NotBlank String name,
                         @NotBlank TimeTable timeTable,
                         @NotBlank Schedule schedule,
                         @NotBlank Set<TeachingHour> teachingHours) {
        this.name = name;
        this.timeTable = timeTable;
        this.schedule = schedule;
        this.teachingHours = teachingHours;
    }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public TimeTable getTimeTable() { return timeTable; }

    public void setTimeTable(TimeTable timeTable) { this.timeTable = timeTable; }

    public Schedule getSchedule() { return schedule; }

    public void setSchedule(Schedule schedule) { this.schedule = schedule; }

    public Set<TeachingHour> getTeachingHours() { return teachingHours; }

    public void setTeachingHours(Set<TeachingHour> teachingHours) { this.teachingHours = teachingHours; }
}
