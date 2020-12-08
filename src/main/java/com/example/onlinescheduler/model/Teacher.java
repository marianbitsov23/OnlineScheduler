package com.example.onlinescheduler.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

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
}
