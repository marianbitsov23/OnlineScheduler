package com.example.onlinescheduler.payload.schedule;

import javax.validation.constraints.NotBlank;

public class SubjectRequest {
    @NotBlank
    private String subjectName;

    public SubjectRequest() {}

    public SubjectRequest(@NotBlank String subjectName) {
        this.subjectName = subjectName;
    }

    public String getSubjectName() { return subjectName; }

    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
}
