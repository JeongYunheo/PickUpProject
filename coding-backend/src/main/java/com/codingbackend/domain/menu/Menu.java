package com.codingbackend.domain.menu;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class Menu {
    private String name;
    private String price;
    private String image;

}