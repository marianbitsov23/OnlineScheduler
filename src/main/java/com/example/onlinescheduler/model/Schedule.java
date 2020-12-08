package com.example.onlinescheduler.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(name = "schedules",
        uniqueConstraints = {
        @UniqueConstraint(columnNames = "scheduleName")
})
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String scheduleName;

    @NotBlank
    private Integer session;

    @NotBlank
    private Long creatorId;

    public Schedule() {}
}
