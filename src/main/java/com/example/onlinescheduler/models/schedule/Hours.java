package com.example.onlinescheduler.models.schedule;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Entity
@Table(name = "hours")
public class Hours {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "subject_id", referencedColumnName = "id")
    private Subject subject;

    /*
    @ManyToOne
    @JoinColumn(name = "group_id", referencedColumnName = "id")
    private Group group;

     */

    @ManyToOne
    @JoinColumn(name = "cabinet_id", referencedColumnName = "id")
    private Cabinet cabinet;

    @NotBlank
    private Integer amount;

    @NotBlank
    @ManyToOne
    @JoinColumn(name = "schedule_id", nullable = false)
    private Schedule schedule;

    public Hours() {}

    public Hours(Subject subject, Cabinet cabinet, @NotBlank Integer amount, @NotBlank Schedule schedule) {
        this.subject = subject;
        this.cabinet = cabinet;
        this.amount = amount;
        this.schedule = schedule;
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Subject getSubject() { return subject; }

    public void setSubject(Subject subject) { this.subject = subject; }

    public Cabinet getCabinet() { return cabinet; }

    public void setCabinet(Cabinet cabinet) { this.cabinet = cabinet; }

    public Integer getAmount() { return amount; }

    public void setAmount(Integer amount) { this.amount = amount; }

    public Schedule getSchedule() { return schedule; }

    public void setSchedule(Schedule schedule) { this.schedule = schedule; }

    /*
    public Group getGroup() { return group; }

    public void setGroup(Group group) { this.group = group; }

     */
}
