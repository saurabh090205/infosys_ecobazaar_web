package com.ecoshop.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "green_certifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GreenCertification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false)
    private Long sellerId;

    /** PENDING, APPROVED, REJECTED */
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "PENDING";

    @Column(length = 500)
    private String notes;

    @Column(updatable = false)
    private LocalDateTime requestedAt;

    private LocalDateTime reviewedAt;

    @PrePersist
    protected void onCreate() {
        this.requestedAt = LocalDateTime.now();
    }
}
