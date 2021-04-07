package com.example.onlinescheduler.models.schedule;

import com.example.onlinescheduler.models.schedule.cabinet.Cabinet;
import com.example.onlinescheduler.models.schedule.cabinet.CabinetCategory;
import com.example.onlinescheduler.models.schedule.timeMangement.TimeSlot;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "teaching_hours")
public class TeachingHour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @ManyToOne
    @JoinColumn(name = "subject_id", referencedColumnName = "id")
    private Subject subject;

    @ManyToOne
    @JoinColumn(name = "group_id", referencedColumnName = "id")
    private Group group;

    @NotBlank
    @ManyToOne
    @JoinColumn(name = "teacher_id", referencedColumnName = "id")
    private Teacher teacher;

    @NotBlank
    private Integer hoursPerWeek;

    @NotBlank
    private Boolean overAWeek;

    @NotBlank
    @ManyToOne
    @JoinColumn(name = "cabinet_id", referencedColumnName = "id")
    private Cabinet cabinet;

    @NotBlank
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "teaching_slots",
            joinColumns = @JoinColumn(name = "teachingHour_id"),
            inverseJoinColumns = @JoinColumn(name = "timeSlot_id"))

    private Set<TimeSlot> timeSlots = new HashSet<>();

    @NotBlank
    @ManyToOne
    @JoinColumn(name = "schedule_id", nullable = false)
    private Schedule schedule;

    @OneToMany(mappedBy = "teachingHour")
    private Set<Lesson> lessons;

    @OneToMany(mappedBy = "subLessonOneTeachingHour")
    private Set<Lesson> subOneLessons;

    @OneToMany(mappedBy = "subLessonTwoTeachingHour")
    private Set<Lesson> subTwoLessons;

    public TeachingHour() {}

    public TeachingHour(@NotBlank Subject subject,
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


    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Subject getSubject() { return subject; }

    public void setSubject(Subject subject) { this.subject = subject; }

    public Cabinet getCabinet() { return cabinet; }

    public void setCabinet(Cabinet cabinet) { this.cabinet = cabinet; }

    public Schedule getSchedule() { return schedule; }

    public void setSchedule(Schedule schedule) { this.schedule = schedule; }

    public Group getGroup() { return group; }

    public void setGroup(Group group) { this.group = group; }

    public Teacher getTeacher() { return teacher; }

    public void setTeacher(Teacher teacher) { this.teacher = teacher; }

    public Integer getHoursPerWeek() { return hoursPerWeek; }

    public void setHoursPerWeek(Integer hoursPerWeek) { this.hoursPerWeek = hoursPerWeek; }

    public Boolean getOverAWeek() { return overAWeek; }

    public void setOverAWeek(Boolean overAWeek) { this.overAWeek = overAWeek; }

    public Set<TimeSlot> getTimeSlots() { return timeSlots; }

    public void setTimeSlots(Set<TimeSlot> timeSlots) { this.timeSlots = timeSlots; }
}
