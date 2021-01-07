package com.example.onlinescheduler.payload.schedule.timeManegment;

import javax.validation.constraints.NotBlank;

public class UpdateTimeTableIdRequest {
    @NotBlank
    private Long timeTableId;

    public UpdateTimeTableIdRequest() {}

    public UpdateTimeTableIdRequest(@NotBlank Long timeTableId) {
        this.timeTableId = timeTableId;
    }

    public Long getTimeTableId() { return timeTableId; }

    public void setTimeTableId(Long timeTableId) { this.timeTableId = timeTableId; }
}
