package com.example.onlinescheduler.models.schedule;

import com.example.onlinescheduler.models.schedule.cabinet.Cabinet;
import com.example.onlinescheduler.models.schedule.timeMangement.TimeSlot;
import com.example.onlinescheduler.models.schedule.timeMangement.TimeTable;
import com.example.onlinescheduler.models.user.User;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "schedules",
        uniqueConstraints = {
        @UniqueConstraint(columnNames = "name")
})
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String name;

    @NotBlank
    @Size(max = 300)
    private String description;

    @NotBlank
    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private SchoolType schoolType;

    @NotBlank
    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @OneToMany(mappedBy="schedule", cascade = CascadeType.ALL)
    Set<Subject> subjects = new HashSet<>();

    @OneToMany(mappedBy="schedule", cascade = CascadeType.ALL)
    Set<Teacher> teachers = new HashSet<>();

    @OneToMany(mappedBy="schedule", cascade = CascadeType.ALL)
    Set<Cabinet> cabinets = new HashSet<>();

    @OneToMany(mappedBy="schedule", cascade = CascadeType.ALL)
    Set<Group> groups = new HashSet<>();

    @OneToMany(mappedBy="schedule", cascade = CascadeType.ALL)
    Set<TeachingHour> teachingHours = new HashSet<>();

    @OneToMany(mappedBy="schedule", cascade = CascadeType.ALL)
    Set<TimeTable> timeTables = new HashSet<>();

    @OneToMany(mappedBy="schedule", cascade = CascadeType.ALL)
    Set<Lesson> lessons = new HashSet<>();

    public Schedule() {}

    public Schedule(@NotBlank @Size(max = 100) String name,
                    @NotBlank @Size(max = 300) String description,
                    @NotBlank User creator,
                    @NotBlank SchoolType schoolType) {
        this.name = name;
        this.description = description;
        this.creator = creator;
        this.schoolType = schoolType;
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public User getCreator() { return creator; }

    public void setCreator(User creator) { this.creator = creator; }

    public SchoolType getSchoolType() { return schoolType; }

    public void setSchoolType(SchoolType schoolType) { this.schoolType = schoolType; }
}
