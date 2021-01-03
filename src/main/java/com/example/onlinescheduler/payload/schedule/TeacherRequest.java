package com.example.onlinescheduler.payload.schedule;

import com.example.onlinescheduler.models.schedule.Subject;

import javax.validation.constraints.NotBlank;
import java.util.Set;

public class TeacherRequest {
    @NotBlank
    private String teacherName;

    @NotBlank
    private Set<Subject> subjects;

    public TeacherRequest() {}

    public TeacherRequest(@NotBlank String teacherName, @NotBlank Set<Subject> subjects) {
        this.teacherName = teacherName;
        this.subjects = subjects;
    }

    public String getTeacherName() { return teacherName; }

    public void setTeacherName(String teacherName) { this.teacherName = teacherName; }

    public Set<Subject> getSubjects() { return subjects; }

    public void setSubjects(Set<Subject> subjects) { this.subjects = subjects; }
}
