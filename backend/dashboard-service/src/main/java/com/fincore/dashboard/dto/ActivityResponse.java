package com.fincore.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityResponse {
    private String id;
    private String action;
    private String description;
    private String timestamp;
    private String icon;
    private String actor;
}
