package com.ecoshop.service;

import com.ecoshop.model.*;
import com.ecoshop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final GreenCertificationRepository certRepository;

    public List<Map<String, Object>> getAllUsers() {
        return userRepository.findAll().stream().map(u -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", u.getId());
            map.put("username", u.getUsername());
            map.put("email", u.getEmail());
            map.put("role", u.getRole().name());
            map.put("fullName", u.getFullName() != null ? u.getFullName() : "");
            map.put("storeName", u.getFullName() != null && !u.getFullName().isBlank() ? u.getFullName() : u.getUsername());
            map.put("isVerified", u.getIsVerified() != null ? u.getIsVerified() : false);
            map.put("createdAt", u.getCreatedAt());
            return map;
        }).collect(Collectors.toList());
    }

    public Map<String, Object> toggleVerification(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        boolean newValue = !(user.getIsVerified() != null && user.getIsVerified());
        user.setIsVerified(newValue);
        userRepository.save(user);
        return Map.of("userId", userId, "isVerified", newValue);
    }

    public List<GreenCertification> getAllCertifications() {
        return certRepository.findAll();
    }

    public List<GreenCertification> getCertificationsByStatus(String status) {
        return certRepository.findByStatus(status);
    }

    public GreenCertification reviewCertification(Long certId, String decision, String notes) {
        GreenCertification cert = certRepository.findById(certId)
                .orElseThrow(() -> new RuntimeException("Certification not found"));
        cert.setStatus(decision.toUpperCase());
        cert.setReviewedAt(LocalDateTime.now());
        if (notes != null) cert.setNotes(notes);

        // Update product certified status
        if ("APPROVED".equalsIgnoreCase(decision)) {
            productRepository.findById(cert.getProductId()).ifPresent(product -> {
                product.setIsCertified(true);
                productRepository.save(product);
            });
        }

        return certRepository.save(cert);
    }

    public Map<String, Object> getPlatformStats() {
        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        Double totalCarbon = orderRepository.totalPlatformCarbon();
        long totalBuyers = userRepository.findAll().stream().filter(u -> "BUYER".equals(u.getRole().name())).count();
        long totalSellers = userRepository.findAll().stream().filter(u -> "SELLER".equals(u.getRole().name())).count();
        long totalCertifications = certRepository.count();
        long pendingCertifications = certRepository.findByStatus("PENDING").size();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalProducts", totalProducts);
        stats.put("totalOrders", totalOrders);
        stats.put("totalCarbonFootprint", totalCarbon != null ? Math.round(totalCarbon * 100.0) / 100.0 : 0.0);
        stats.put("totalBuyers", totalBuyers);
        stats.put("totalSellers", totalSellers);
        stats.put("totalCertifications", totalCertifications);
        stats.put("pendingCertifications", pendingCertifications);
        return stats;
    }
}
