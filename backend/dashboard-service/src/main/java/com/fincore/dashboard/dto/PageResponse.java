package com.fincore.dashboard.dto;

import lombok.Data;

import java.util.List;

@Data
public class PageResponse<T> {

    private List<T> content;
    private int totalPages;
    private long totalElements;
    private int size;
    private int number;
    private boolean first;
    private boolean last;
    private int numberOfElements;
    private boolean empty;
}