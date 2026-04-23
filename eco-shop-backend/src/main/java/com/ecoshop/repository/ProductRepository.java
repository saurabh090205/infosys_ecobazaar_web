package com.ecoshop.repository;

import com.ecoshop.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE " +
           "(:sellerId IS NULL OR p.sellerId = :sellerId) AND " +
           "(:q IS NULL OR (:q = '') OR LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :q, '%'))) AND " +
           "(:category IS NULL OR (:category = '') OR p.category = :category) AND " +
           "(:ecoFriendly IS NULL OR :ecoFriendly = false OR p.isEcoFriendly = true)")
    List<Product> searchProductsWithFilters(@Param("q") String query,
                                            @Param("category") String category,
                                            @Param("ecoFriendly") Boolean ecoFriendly,
                                            @Param("sellerId") Long sellerId,
                                            org.springframework.data.domain.Sort sort);

    @Query("SELECT p FROM Product p WHERE p.category = :cat AND p.id <> :pid AND p.carbonFootprintKg < :carbon ORDER BY p.carbonFootprintKg ASC")
    List<Product> findGreenerAlternatives(@Param("cat") String category,
                                          @Param("pid") Long productId,
                                          @Param("carbon") Double carbonFootprint);

    List<Product> findBySellerId(Long sellerId);
}
