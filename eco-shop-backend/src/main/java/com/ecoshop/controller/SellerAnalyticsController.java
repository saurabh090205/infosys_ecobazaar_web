package com.ecoshop.controller;

import com.ecoshop.model.GreenCertification;
import com.ecoshop.model.User;
import com.ecoshop.repository.UserRepository;
import com.ecoshop.service.SellerAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
public class SellerAnalyticsController {

    private final SellerAnalyticsService sellerAnalyticsService;
    private final UserRepository userRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSellerStats(Authentication authentication) {
        Long sellerId = getUserId(authentication);
        return ResponseEntity.ok(sellerAnalyticsService.getSellerStats(sellerId));
    }

    @GetMapping("/certifications")
    public ResponseEntity<List<GreenCertification>> getSellerCertifications(Authentication authentication) {
        Long sellerId = getUserId(authentication);
        return ResponseEntity.ok(sellerAnalyticsService.getSellerCertifications(sellerId));
    }

    @PostMapping("/certifications")
    public ResponseEntity<GreenCertification> requestCertification(
            Authentication authentication,
            @RequestBody Map<String, Long> body) {
        Long sellerId = getUserId(authentication);
        Long productId = body.get("productId");
        return ResponseEntity.ok(sellerAnalyticsService.requestCertification(sellerId, productId));
    }

    private Long getUserId(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }
}
