package com.ecoshop.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(length = 500)
    private String imageUrl;

    @Column(length = 50)
    private String category;

    /** Eco-friendliness rating from 1 (worst) to 5 (best). */
    @Column(nullable = false)
    private Integer ecoRating;

    /** Carbon footprint in kg CO₂-equivalent per unit. */
    @Column(nullable = false)
    private Double carbonFootprintKg;

    @Column(nullable = false)
    private Boolean isEcoFriendly;

    private Long sellerId;

    @Column(nullable = false)
    private Integer stock;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
