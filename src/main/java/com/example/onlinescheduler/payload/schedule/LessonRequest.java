package com.example.onlinescheduler.payload.schedule;

import com.example.onlinescheduler.models.schedule.Group;
import com.example.onlinescheduler.models.schedule.Schedule;
import com.example.onlinescheduler.models.schedule.TeachingHour;
import com.example.onlinescheduler.models.schedule.timeMangement.TimeTable;

import javax.validation.constraints.NotBlank;

public class LessonRequest {
    @NotBlank
    private Schedule schedule;

    @NotBlank
    private Integer weekDay;

    @NotBlank
    private Integer slotIndex;

    private TimeTable timeTable;

    private Group group;

    private TeachingHour teachingHour;

    private TeachingHour subLessonOneTeachingHour;

    private TeachingHour subLessonTwoTeachingHour;

    public LessonRequest() {}

    public LessonRequest(
            @NotBlank Schedule schedule,
            @NotBlank Integer weekDay,
            @NotBlank Integer slotIndex,
            TimeTable timeTable,
            Group group,
            TeachingHour teachingHour,
            TeachingHour subLessonOneTeachingHour,
            TeachingHour subLessonTwoTeachingHour) {
        this.schedule = schedule;
        this.weekDay = weekDay;
        this.slotIndex = slotIndex;
        this.group = group;
        this.timeTable = timeTable;
        this.teachingHour = teachingHour;
        this.subLessonOneTeachingHour = subLessonOneTeachingHour;
        this.subLessonTwoTeachingHour = subLessonTwoTeachingHour;
    }


    public Schedule getSchedule() { return schedule; }

    public void setSchedule(Schedule schedule) { this.schedule = schedule; }

    public TeachingHour getTeachingHour() { return teachingHour; }

    public void setTeachingHour(TeachingHour teachingHour) { this.teachingHour = teachingHour; }

    public Integer getWeekDay() { return weekDay; }

    public void setWeekDay(Integer weekDay) { this.weekDay = weekDay; }

    public Integer getSlotIndex() { return slotIndex; }

    public void setSlotIndex(Integer slotIndex) { this.slotIndex = slotIndex; }

    public TeachingHour getSubLessonOneTeachingHour() { return subLessonOneTeachingHour; }

    public void setSubLessonOneTeachingHour(TeachingHour subLessonOneTeachingHour) { this.subLessonOneTeachingHour = subLessonOneTeachingHour; }

    public TeachingHour getSubLessonTwoTeachingHour() { return subLessonTwoTeachingHour; }

    public void setSubLessonTwoTeachingHour(TeachingHour subLessonTwoTeachingHour) { this.subLessonTwoTeachingHour = subLessonTwoTeachingHour; }

    public TimeTable getTimeTable() { return timeTable; }

    public void setTimeTable(TimeTable timeTable) { this.timeTable = timeTable; }

    public Group getGroup() { return group; }

    public void setGroup(Group group) { this.group = group; }

}
