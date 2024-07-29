package com.codingbackend.domain.menu;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface MenuMapper {
    @Insert("""
            INSERT INTO menu (restaurant_id, name, price, img)
            VALUES (#{restaurantId}, #{name}, #{price}, #{img})
            """)
    void insert(Menu menu);

    @Select("""
            SELECT *
            FROM menu
            WHERE restaurant_id = #{placeId}
            """)
    List<Menu> selectMenu(Integer placeId);
    
    @Update("UPDATE menu SET name = #{name}, price = #{price}, img = #{img} WHERE id = #{id}")
    void update(Menu menu);
}
