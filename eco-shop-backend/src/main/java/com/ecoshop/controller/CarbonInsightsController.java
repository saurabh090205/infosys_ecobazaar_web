package com.ecoshop.controller;

import com.ecoshop.model.User;
import com.ecoshop.repository.UserRepository;
import com.ecoshop.service.CarbonInsightsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/carbon-insights")
@RequiredArgsConstructor
public class CarbonInsightsController {

    private final CarbonInsightsService carbonInsightsService;
    private final UserRepository userRepository;

    @GetMapping("/user-stats")
    public ResponseEntity<Map<String, Object>> getUserStats(Authentication authentication) {
        Long userId = getUserId(authentication);
        return ResponseEntity.ok(carbonInsightsService.getUserStats(userId));
    }

    @GetMapping("/monthly-trend")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyTrend(Authentication authentication) {
        Long userId = getUserId(authentication);
        return ResponseEntity.ok(carbonInsightsService.getMonthlyTrend(userId));
    }

    @GetMapping("/top-products")
    public ResponseEntity<List<Map<String, Object>>> getTopProducts(Authentication authentication) {
        Long userId = getUserId(authentication);
        return ResponseEntity.ok(carbonInsightsService.getTopProducts(userId));
    }

    private Long getUserId(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }
}
