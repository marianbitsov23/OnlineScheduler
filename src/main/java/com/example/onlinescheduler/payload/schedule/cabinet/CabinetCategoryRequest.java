package com.example.onlinescheduler.payload.schedule.cabinet;

import javax.validation.constraints.NotBlank;

public class CabinetCategoryRequest {
    @NotBlank
    private String name;

    public CabinetCategoryRequest() {}

    public CabinetCategoryRequest(@NotBlank String name) {
        this.name = name;
    }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }
}
