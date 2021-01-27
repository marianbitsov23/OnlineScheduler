package com.example.onlinescheduler.models.schedule;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "teachers",
    uniqueConstraints = {
    @UniqueConstraint(columnNames = "name")
})
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String name;

    @NotBlank
    @ManyToOne
    @JoinColumn(name = "schedule_id", referencedColumnName = "id")
    private Schedule schedule;

    @NotBlank
    @Size(max = 10)
    private String initials;

    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL)
    Set<TeachingHour> teachingHours = new HashSet<>();

    public Teacher() {}

    public Teacher(@NotBlank @Size(max = 100) String name, @NotBlank @Size(max = 10) String initials, @NotBlank Schedule schedule) {
        this.name = name;
        this.initials = initials;
        this.schedule = schedule;
    }

    public String getInitials() { return initials; }

    public void setInitials(String initials) { this.initials = initials; }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Schedule getSchedule() { return null; }

    public void setSchedule(Schedule schedule) { this.schedule = schedule; }
}
