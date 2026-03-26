package com.ecoshop.repository;

import com.ecoshop.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("SELECT oi.productId, SUM(oi.quantity * oi.carbonAtPurchase) as totalCarbon " +
           "FROM OrderItem oi JOIN oi.order o JOIN Product p ON oi.productId = p.id WHERE o.userId = :userId " +
           "GROUP BY oi.productId ORDER BY SUM(oi.quantity) DESC, MAX(p.ecoRating) DESC")
    List<Object[]> topCarbonProductsByUser(@Param("userId") Long userId);

    @Query("SELECT oi FROM OrderItem oi WHERE oi.productId IN :productIds")
    List<OrderItem> findByProductIdIn(@Param("productIds") List<Long> productIds);

    @Query("SELECT SUM(oi.quantity) FROM OrderItem oi WHERE oi.productId IN :productIds")
    Long totalUnitsSoldForProducts(@Param("productIds") List<Long> productIds);

    @Query("SELECT SUM(oi.quantity * oi.carbonAtPurchase) FROM OrderItem oi WHERE oi.productId IN :productIds")
    Double totalCarbonSoldForProducts(@Param("productIds") List<Long> productIds);
}
