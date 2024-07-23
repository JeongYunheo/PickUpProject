package com.codingbackend.domain.restaurant;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface RestaurantMapper {

    @Insert("""
            INSERT INTO restaurant (restaurant_id, user_id, restaurant_name, restaurant_tel, address, logo, latitude, longitude)
            VALUES (#{restaurantId},#{userId}, #{restaurantName}, #{restaurantTel}, #{address}, #{logo}, #{latitude}, #{longitude})
            """)
    void insert(RestaurantRequestDto restaurant);

    @Select("SELECT * FROM category WHERE id = #{category}")
    Category selectCategory(Integer category);

    @Update("""
            UPDATE restaurant 
            SET logo=#{logo}
            WHERE restaurant_id=#{restaurantId}
            """)
    void updateLogo(RestaurantRequestDto restaurant);

    @Select("SELECT * FROM restaurant")
    List<RestaurantRequestDto> selectAll();

}
