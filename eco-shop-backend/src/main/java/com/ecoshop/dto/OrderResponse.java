package com.ecoshop.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponse {
    private Long id;
    private Double totalPrice;
    private Double totalCarbonFootprint;
    private String status;
    private String shippingAddress;
    private LocalDateTime createdAt;
    private List<OrderItemDetail> items;

    @Data
    @Builder
    public static class OrderItemDetail {
        private Long productId;
        private String productName;
        private Integer quantity;
        private Double priceAtPurchase;
        private Double carbonAtPurchase;
    }
}
