package com.ecoshop.dto;

import lombok.Data;

@Data
public class UserProfileRequest {
    private String fullName;
    private String email;
    private String address;
    private String phone;
}
