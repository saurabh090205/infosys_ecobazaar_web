package com.ecoshop.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ProductRequest {
    @NotBlank(message = "Product name is required")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double price;

    private String imageUrl;
    private String category;

    @NotNull(message = "Eco rating is required")
    @Min(1) @Max(5)
    private Integer ecoRating;

    @NotNull(message = "Carbon footprint is required")
    @PositiveOrZero
    private Double carbonFootprintKg;

    private Boolean isEcoFriendly;

    @NotNull(message = "Stock is required")
    @PositiveOrZero
    private Integer stock;
}
