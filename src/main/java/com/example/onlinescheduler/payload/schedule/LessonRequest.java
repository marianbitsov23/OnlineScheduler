package com.example.onlinescheduler.payload.schedule;

import com.example.onlinescheduler.models.schedule.Schedule;
import com.example.onlinescheduler.models.schedule.TeachingHour;
import javax.validation.constraints.NotBlank;

public class LessonRequest {
    @NotBlank
    private Schedule schedule;

    @NotBlank
    private Integer weekDay;

    @NotBlank
    private Integer slotIndex;

    @NotBlank
    private TeachingHour teachingHour;

    public LessonRequest() {}

    public LessonRequest(
            @NotBlank Schedule schedule,
            @NotBlank Integer weekDay,
            @NotBlank Integer slotIndex,
            @NotBlank TeachingHour teachingHour) {
        this.schedule = schedule;
        this.weekDay = weekDay;
        this.slotIndex = slotIndex;
        this.teachingHour = teachingHour;
    }


    public Schedule getSchedule() { return schedule; }

    public void setSchedule(Schedule schedule) { this.schedule = schedule; }

    public TeachingHour getTeachingHour() { return teachingHour; }

    public void setTeachingHour(TeachingHour teachingHour) { this.teachingHour = teachingHour; }

    public Integer getWeekDay() { return weekDay; }

    public void setWeekDay(Integer weekDay) { this.weekDay = weekDay; }

    public Integer getSlotIndex() { return slotIndex; }

    public void setSlotIndex(Integer slotIndex) { this.slotIndex = slotIndex; }
}
