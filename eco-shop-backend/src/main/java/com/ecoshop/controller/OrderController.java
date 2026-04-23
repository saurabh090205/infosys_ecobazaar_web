package com.ecoshop.controller;

import com.ecoshop.dto.CheckoutRequest;
import com.ecoshop.dto.OrderResponse;
import com.ecoshop.model.User;
import com.ecoshop.repository.UserRepository;
import com.ecoshop.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout(
            @RequestBody CheckoutRequest request,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        return ResponseEntity.ok(orderService.checkout(userId, request));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getOrderHistory(Authentication authentication) {
        Long userId = getUserId(authentication);
        return ResponseEntity.ok(orderService.getOrderHistory(userId));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            @PathVariable Long id,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        return ResponseEntity.ok(orderService.cancelOrder(id, userId));
    }

    private Long getUserId(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }
}
