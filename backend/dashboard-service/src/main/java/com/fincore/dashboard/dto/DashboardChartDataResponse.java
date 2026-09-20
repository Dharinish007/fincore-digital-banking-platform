package com.fincore.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardChartDataResponse {

    private List<String> labels;
    private List<ChartDataset> datasets;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChartDataset {
        private List<Number> data;
        private String label;
        private Object backgroundColor;
        private Object borderColor;
        private Boolean fill;
    }
}
