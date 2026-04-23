package com.ecoshop.service;

import com.ecoshop.model.Product;
import com.ecoshop.repository.OrderItemRepository;
import com.ecoshop.repository.OrderRepository;
import com.ecoshop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class CarbonInsightsService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;

    public Map<String, Object> getUserStats(Long userId) {
        Double totalCarbon = orderRepository.sumCarbonByUserId(userId);
        if (totalCarbon == null) totalCarbon = 0.0;

        // Calculate monthly footprint (last month's orders)
        List<Object[]> trend = orderRepository.monthlyCarbonTrend(userId);
        double monthlyFootprint = trend.isEmpty() ? 0.0 :
                ((Number) trend.get(trend.size() - 1)[1]).doubleValue();

        // Calculate rank
        List<Object[]> ranking = orderRepository.carbonRanking();
        int rank = 1;
        for (Object[] r : ranking) {
            if (((Number) r[0]).longValue() == userId) break;
            rank++;
        }
        if (rank > ranking.size()) rank = ranking.size() + 1;

        return Map.of(
                "totalCarbonSaved", Math.round(totalCarbon * 100.0) / 100.0,
                "monthlyFootprint", Math.round(monthlyFootprint * 100.0) / 100.0,
                "monthlyCarbonSaved", Math.round(monthlyFootprint * 100.0) / 100.0,
                "carbonRank", rank
        );
    }

    public List<Map<String, Object>> getMonthlyTrend(Long userId) {
        List<Object[]> raw = orderRepository.monthlyCarbonTrend(userId);
        List<Map<String, Object>> result = new ArrayList<>();

        if (raw.isEmpty()) {
            // Return default months with zero values
            String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun"};
            for (String m : months) {
                result.add(Map.of("month", m, "carbon", 0.0));
            }
            return result;
        }

        for (Object[] row : raw) {
            result.add(Map.of(
                    "month", row[0].toString().trim(),
                    "carbon", Math.round(((Number) row[1]).doubleValue() * 100.0) / 100.0
            ));
        }
        return result;
    }

    public List<Map<String, Object>> getTopProducts(Long userId) {
        List<Object[]> raw = orderItemRepository.topCarbonProductsByUser(userId);
        List<Map<String, Object>> result = new ArrayList<>();

        int limit = Math.min(raw.size(), 5);
        for (int i = 0; i < limit; i++) {
            Long productId = ((Number) raw.get(i)[0]).longValue();
            double carbonSaved = ((Number) raw.get(i)[1]).doubleValue();
            String productName = productRepository.findById(productId)
                    .map(Product::getName)
                    .orElse("Unknown Product");
            result.add(Map.of(
                    "productName", productName,
                    "carbonSaved", Math.round(carbonSaved * 100.0) / 100.0
            ));
        }

        return result;
    }
}
