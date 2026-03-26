package com.ecoshop.service;

import com.ecoshop.model.GreenCertification;
import com.ecoshop.model.Product;
import com.ecoshop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SellerAnalyticsService {

    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;
    private final GreenCertificationRepository certRepository;

    public Map<String, Object> getSellerStats(Long sellerId) {
        List<Product> products = productRepository.findBySellerId(sellerId);
        List<Long> productIds = products.stream().map(Product::getId).collect(Collectors.toList());

        long totalProducts = products.size();
        long ecoProducts = products.stream().filter(p -> Boolean.TRUE.equals(p.getIsEcoFriendly())).count();

        Long totalUnitsSold = productIds.isEmpty() ? 0L :
                orderItemRepository.totalUnitsSoldForProducts(productIds);
        Double totalCarbonSold = productIds.isEmpty() ? 0.0 :
                orderItemRepository.totalCarbonSoldForProducts(productIds);

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalProducts", totalProducts);
        stats.put("ecoProducts", ecoProducts);
        stats.put("totalUnitsSold", totalUnitsSold != null ? totalUnitsSold : 0);
        stats.put("totalCarbonSold", totalCarbonSold != null ? Math.round(totalCarbonSold * 100.0) / 100.0 : 0.0);
        stats.put("avgEcoRating", products.stream()
                .mapToInt(Product::getEcoRating)
                .average()
                .orElse(0.0));
        return stats;
    }

    public List<GreenCertification> getSellerCertifications(Long sellerId) {
        return certRepository.findBySellerId(sellerId);
    }

    public GreenCertification requestCertification(Long sellerId, Long productId) {
        // Verify the product belongs to the seller
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        if (!product.getSellerId().equals(sellerId)) {
            throw new RuntimeException("Product does not belong to this seller");
        }

        // Check for existing requests
        Optional<GreenCertification> existing = certRepository.findByProductIdAndSellerId(productId, sellerId);
        if (existing.isPresent()) {
            String status = existing.get().getStatus();
            if ("PENDING".equals(status) || "APPROVED".equals(status)) {
                throw new RuntimeException("A certification request already exists for this product (Status: " + status + ")");
            }
        }

        GreenCertification cert = GreenCertification.builder()
                .productId(productId)
                .sellerId(sellerId)
                .status("PENDING")
                .build();
        return certRepository.save(cert);
    }
}
