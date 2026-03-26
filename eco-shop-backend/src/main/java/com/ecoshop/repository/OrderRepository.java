package com.ecoshop.repository;

import com.ecoshop.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT COALESCE(SUM(o.totalCarbonFootprint), 0) FROM Order o WHERE o.userId = :userId AND o.status != 'CANCELLED'")
    Double sumCarbonByUserId(@Param("userId") Long userId);

    @Query(value = "SELECT FORMATDATETIME(o.created_at, 'MMM') as mon, COALESCE(SUM(o.total_carbon_footprint), 0) " +
           "FROM orders o WHERE o.user_id = :userId AND o.status != 'CANCELLED' GROUP BY FORMATDATETIME(o.created_at, 'MMM'), MONTH(o.created_at) " +
           "ORDER BY MONTH(o.created_at)", nativeQuery = true)
    List<Object[]> monthlyCarbonTrend(@Param("userId") Long userId);

    @Query("SELECT o.userId, SUM(o.totalCarbonFootprint) as total FROM Order o WHERE o.status != 'CANCELLED' GROUP BY o.userId ORDER BY total DESC")
    List<Object[]> carbonRanking();

    @Query("SELECT COALESCE(SUM(o.totalCarbonFootprint), 0) FROM Order o WHERE o.status != 'CANCELLED'")
    Double totalPlatformCarbon();

    @Query("SELECT COUNT(DISTINCT o.userId) FROM Order o")
    Long countDistinctBuyers();

    List<Order> findByUserId(Long userId);
}
