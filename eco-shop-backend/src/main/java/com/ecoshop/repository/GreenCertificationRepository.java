package com.ecoshop.repository;

import com.ecoshop.model.GreenCertification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface GreenCertificationRepository extends JpaRepository<GreenCertification, Long> {
    List<GreenCertification> findBySellerId(Long sellerId);
    List<GreenCertification> findByStatus(String status);
    Optional<GreenCertification> findByProductIdAndSellerId(Long productId, Long sellerId);
}
