package com.fincore.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SummaryCardResponse {
    private String title;
    private Object value;
    private String icon;
    private Double trend;
    private String iconBgColor;
    private String iconColor;
}
