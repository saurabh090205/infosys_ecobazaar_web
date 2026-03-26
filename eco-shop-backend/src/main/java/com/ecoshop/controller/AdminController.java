package com.ecoshop.controller;

import com.ecoshop.model.GreenCertification;
import com.ecoshop.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{id}/verify")
    public ResponseEntity<Map<String, Object>> verifyUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleVerification(id));
    }

    @GetMapping("/certifications")
    public ResponseEntity<List<GreenCertification>> getCertifications(
            @RequestParam(required = false) String status) {
        if (status != null && !status.isBlank()) {
            return ResponseEntity.ok(adminService.getCertificationsByStatus(status));
        }
        return ResponseEntity.ok(adminService.getAllCertifications());
    }

    @PutMapping("/certifications/{id}/review")
    public ResponseEntity<GreenCertification> reviewCertification(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String decision = body.get("decision");
        String notes = body.get("notes");
        return ResponseEntity.ok(adminService.reviewCertification(id, decision, notes));
    }

    @GetMapping("/platform-stats")
    public ResponseEntity<Map<String, Object>> getPlatformStats() {
        return ResponseEntity.ok(adminService.getPlatformStats());
    }
}
