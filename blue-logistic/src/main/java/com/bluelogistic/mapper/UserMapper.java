package com.bluelogistic.mapper;

import com.bluelogistic.dto.UserResponse;
import com.bluelogistic.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    
    public UserResponse toResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getRole().name(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }
}