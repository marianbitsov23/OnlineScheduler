package com.example.onlinescheduler.models.schedule;

import com.example.onlinescheduler.models.schedule.timeMangement.TimeTable;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Entity
@Table(name = "lessons")
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @ManyToOne
    @JoinColumn(name = "schedule_id", referencedColumnName = "id")
    private Schedule schedule;

    @NotBlank
    private Integer weekDay;

    @NotBlank
    private Integer slotIndex;

    @ManyToOne
    @JoinColumn(name = "time_table_id", referencedColumnName = "id")
    private TimeTable timeTable;

    @ManyToOne
    @JoinColumn(name = "group_id", referencedColumnName = "id")
    private Group group;

    @ManyToOne
    @JoinColumn(name = "teachingHour_id", referencedColumnName = "id")
    private TeachingHour teachingHour;

    @ManyToOne
    @JoinColumn(name = "subLessonOneTeachingHour_id", referencedColumnName = "id")
    private TeachingHour subLessonOneTeachingHour;

    @ManyToOne
    @JoinColumn(name = "subLessonTwoTeachingHour_id", referencedColumnName = "id")
    private TeachingHour subLessonTwoTeachingHour;

    public Lesson() {}

    public Lesson(@NotBlank Schedule schedule,
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
        this.timeTable = timeTable;
        this.group = group;
        this.teachingHour = teachingHour;
        this.subLessonOneTeachingHour = subLessonOneTeachingHour;
        this.subLessonTwoTeachingHour = subLessonTwoTeachingHour;
    }


    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Schedule getSchedule() { return schedule; }

    public void setSchedule(Schedule schedule) { this.schedule = schedule; }

    public TeachingHour getTeachingHour() { return teachingHour; }

    public void setTeachingHour(TeachingHour teachingHour) { this.teachingHour = teachingHour; }

    public Integer getSlotIndex() { return slotIndex; }

    public void setSlotIndex(Integer slotIndex) { this.slotIndex = slotIndex; }

    public Integer getWeekDay() { return weekDay; }

    public void setWeekDay(Integer weekDay) { this.weekDay = weekDay; }

    public TeachingHour getSubLessonOneTeachingHour() { return subLessonOneTeachingHour; }

    public void setSubLessonOneTeachingHour(TeachingHour subLessonOneTeachingHour) { this.subLessonOneTeachingHour = subLessonOneTeachingHour; }

    public TeachingHour getSubLessonTwoTeachingHour() { return subLessonTwoTeachingHour; }

    public void setSubLessonTwoTeachingHour(TeachingHour subLessonTwoTeachingHour) { this.subLessonTwoTeachingHour = subLessonTwoTeachingHour; }

    public TimeTable getTimeTable() { return timeTable; }

    public void setTimeTable(TimeTable timeTable) { this.timeTable = timeTable; }

    public Group getGroup() { return group; }

    public void setGroup(Group group) { this.group = group; }
}
