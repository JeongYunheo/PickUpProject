package com.codingbackend.domain.review;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class Review {
    private Integer id;
    private Long restaurantId;
    private Integer userId;
    private Integer rating;
    private Integer reviewCount;
    private Integer reviewSum;
    private String content;
    private LocalDateTime inserted;
    private Boolean reviewStatus;
    private List<ReviewFile> fileList;
}

@Data
@AllArgsConstructor
class ReviewFile {
    private String name;
    private String src;
}