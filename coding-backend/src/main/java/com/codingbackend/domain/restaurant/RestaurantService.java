package com.codingbackend.domain.restaurant;

import com.codingbackend.domain.menu.MenuRestaurantPut;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantMapper restaurantMapper;
    private final S3Client s3Client;

    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;

    public void insertRestaurantInfo(RestaurantRequestDto restaurant, MultipartFile file) throws IOException {
        // 데이터베이스에 저장
        restaurantMapper.insert(restaurant);

        //s3 저장
        if (file != null) {
            //실제 S3 파일 저장
            String key = STR."prj4/restaurant/\{restaurant.getRestaurantId()}/\{file.getOriginalFilename()}";
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .acl(ObjectCannedACL.PUBLIC_READ)
                    .build();
            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
        }

    }

    public Category getcategory(Integer category) {
        return restaurantMapper.selectCategory(category);
    }

    public List<RestaurantRequestDto> getAll() {
        List<RestaurantRequestDto> restaurants = restaurantMapper.selectAll();
        return restaurants.stream().map(restaurant -> {
            String logoPath = STR."\{srcPrefix}restaurant/\{restaurant.getRestaurantId()}/\{restaurant.getLogo()}";
            restaurant.setLogo(logoPath);
            return restaurant;
        }).collect(Collectors.toList());
    }

    public List<Restaurant> getRestaurantsByUserId(Integer userId) {
        List<Restaurant> restaurants = restaurantMapper.selectByUserId(userId);
        return restaurants.stream().map(restaurant -> {
            String logoPath = STR."\{srcPrefix}restaurant/\{restaurant.getRestaurantId()}/\{restaurant.getLogo()}";
            restaurant.setLogo(logoPath);
            return restaurant;
        }).collect(Collectors.toList());
    }

    public void updateRestaurant(Long restaurantId, MenuRestaurantPut menuRestaurant) throws IOException {
        String logoFileName = null;

        // 로고 S3 저장
        if (menuRestaurant.getLogo() != null && !menuRestaurant.getLogo().isEmpty()) {
            String key = "prj4/restaurant/" + restaurantId + "/" + menuRestaurant.getLogo().getOriginalFilename();
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .acl(ObjectCannedACL.PUBLIC_READ)
                    .build();
            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(menuRestaurant.getLogo().getInputStream(), menuRestaurant.getLogo().getSize()));

            logoFileName = menuRestaurant.getLogo().getOriginalFilename();
        }

        // Update restaurant information
        restaurantMapper.updateRestaurantInfo(
                restaurantId,
                menuRestaurant.getRestaurantName(),
                menuRestaurant.getRestaurantTel(),
                logoFileName
        );
    }

}