package com.example.onlinescheduler.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Set;

@Entity
@Table(name = "subjects",
        uniqueConstraints = {
        @UniqueConstraint(columnNames = "subjectName")
})
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 120)
    private String subjectName;

    @ManyToMany(mappedBy = "subjects")
    Set<Teacher> teachers;

    public Subject() {}

    public Subject(@NotBlank @Size(max = 120) String subjectName, Set<Teacher> teachers) {
        this.subjectName = subjectName;
        this.teachers = teachers;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public Set<Teacher> getTeachers() {
        return teachers;
    }

    public void setTeachers(Set<Teacher> teachers) {
        this.teachers = teachers;
    }
}
