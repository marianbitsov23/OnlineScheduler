package com.example.onlinescheduler.models.schedule;

import com.example.onlinescheduler.models.user.User;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Set;

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
    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @OneToMany(mappedBy = "schedule")
    private Set<Hours> hours;

    public Schedule() {}

    public Schedule(@NotBlank @Size(max = 100) String scheduleName, @NotBlank Integer session, @NotBlank User creator, Set<Hours> hours) {
        this.scheduleName = scheduleName;
        this.session = session;
        this.creator = creator;
        this.hours = hours;
    }

    public Schedule(@NotBlank @Size(max = 100) String scheduleName, @NotBlank Integer session, @NotBlank User creator) {
        this.scheduleName = scheduleName;
        this.session = session;
        this.creator = creator;
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getScheduleName() { return scheduleName; }

    public void setScheduleName(String scheduleName) { this.scheduleName = scheduleName; }

    public Integer getSession() { return session; }

    public void setSession(Integer session) { this.session = session; }

    public User getCreator() { return creator; }

    public void setCreator(User creator) { this.creator = creator; }

    public Set<Hours> getHours() { return hours; }

    public void setHours(Set<Hours> hours) { this.hours = hours; }

}
