package com.example.onlinescheduler.models.schedule;

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

    @NotBlank
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
                  @NotBlank TeachingHour teachingHour,
                  TeachingHour subLessonOneTeachingHour,
                  TeachingHour subLessonTwoTeachingHour) {
        this.schedule = schedule;
        this.weekDay = weekDay;
        this.slotIndex = slotIndex;
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
}
