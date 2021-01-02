package com.example.onlinescheduler.model.schedule;

import com.example.onlinescheduler.model.schedule.Subject;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Set;

@Entity
@Table(name = "teachers",
    uniqueConstraints = {
    @UniqueConstraint(columnNames = "teacherName")
})
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String teacherName;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "teacher_subjects",
            joinColumns = @JoinColumn(name = "teacherId"),
            inverseJoinColumns = @JoinColumn(name = "subjectId"))
    Set<Subject> subjects;

    public Teacher() {}

    public Teacher(@NotBlank @Size(max = 100) String teacherName, Set<Subject> subjects) {
        this.teacherName = teacherName;
        this.subjects = subjects;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public Set<Subject> getSubjects() {
        return subjects;
    }

    public void setSubjects(Set<Subject> subjects) {
        this.subjects = subjects;
    }
}