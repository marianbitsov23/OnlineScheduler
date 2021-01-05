package com.example.onlinescheduler.models.schedule;

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

    @OneToMany(mappedBy = "subject")
    private Set<Hours> hours;

    public Subject() {}

    public Subject(@NotBlank @Size(max = 120) String subjectName) { this.subjectName = subjectName; }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getSubjectName() { return subjectName; }

    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

}
