package com.codingbackend.domain.menu;

import lombok.Data;

import java.util.List;

@Data
public class PlaceDto {
    private BasicInfo basicInfo;
    private MenuInfoDto menuInfo;
}

@Data
class BasicInfo {
    private CategoryDto category;
    private FeedbackDto feedback;
}

@Data
class CategoryDto {
    private String catename;
    private String cate1name;
}

@Data
class FeedbackDto {
    private Integer scoresum;
    private Integer scorecnt;
}

@Data
class MenuInfoDto {
    private Integer menucount;
    private List<MenuDto> menuList;
}

@Data
class MenuDto {
    private String price;
    private String menu;
    private String img;
}