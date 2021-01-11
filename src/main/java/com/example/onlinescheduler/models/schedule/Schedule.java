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
    @Size(max = 300)
    private String description;

    @NotBlank
    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @NotBlank
    @OneToOne
    @JoinColumn(name = "parent_group_id", referencedColumnName = "id")
    private Group parentGroup;

    @OneToMany(mappedBy = "schedule")
    private Set<Hours> hours;

    public Schedule() {}

    public Schedule(@NotBlank @Size(max = 100) String scheduleName, @NotBlank @Size(max = 300) String description, @NotBlank User creator, Set<Hours> hours) {
        this.scheduleName = scheduleName;
        this.description = description;
        this.creator = creator;
        this.hours = hours;
    }

    public Schedule(@NotBlank @Size(max = 100) String scheduleName, @NotBlank @Size(max = 300) String description, @NotBlank User creator, @NotBlank Group parentGroup) {
        this.scheduleName = scheduleName;
        this.description = description;
        this.creator = creator;
        this.parentGroup = parentGroup;
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getScheduleName() { return scheduleName; }

    public void setScheduleName(String scheduleName) { this.scheduleName = scheduleName; }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public User getCreator() { return creator; }

    public void setCreator(User creator) { this.creator = creator; }

    public Set<Hours> getHours() { return hours; }

    public void setHours(Set<Hours> hours) { this.hours = hours; }

    public Group getParentGroup() { return parentGroup; }

    public void setParentGroup(Group parentGroup) { this.parentGroup = parentGroup; }
}
