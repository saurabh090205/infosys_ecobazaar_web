package com.ecoshop.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class CartResponse {
    private List<CartItemDetail> items;
    private Double totalPrice;
    private Double totalCarbonFootprint;
    private Integer totalItems;

    @Data
    @Builder
    public static class CartItemDetail {
        private Long id;
        private Long productId;
        private String productName;
        private String productImage;
        private Double productPrice;
        private Double carbonFootprintKg;
        private Integer ecoRating;
        private Integer quantity;
        private Double subtotal;
        private Double carbonSubtotal;
    }
}
