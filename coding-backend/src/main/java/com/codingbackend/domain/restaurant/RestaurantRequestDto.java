package com.codingbackend.domain.restaurant;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RestaurantRequestDto {
    private Integer id;
    private Long restaurantId;
    private Integer userId;
    private String restaurantName;
    private String restaurantTel; //전화번호
    private String address;
    private Double latitude;
    private Double longitude;
    private LocalDateTime inserted;

    // 카테고리 이름
    private String categoryName;
}