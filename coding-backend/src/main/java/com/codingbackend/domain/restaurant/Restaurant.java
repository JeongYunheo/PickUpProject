package com.codingbackend.domain.restaurant;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Restaurant {
    private Integer id;
    private Long restaurantId;
    private Integer userId;
    private String category;
    private String restaurantName;
    private String restaurantNumber; //전화번호
    private String address;
    private Double latitude;
    private Double longitude;
    private LocalDateTime inserted;
}