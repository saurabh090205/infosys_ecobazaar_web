package com.ecoshop.repository;

import com.ecoshop.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByIsEcoFriendlyTrue();

    List<Product> findByCategory(String category);

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%',:q,'%'))")
    List<Product> search(@Param("q") String query);

    @Query("SELECT p FROM Product p WHERE p.category = :cat AND p.id <> :pid AND p.carbonFootprintKg < :carbon ORDER BY p.carbonFootprintKg ASC")
    List<Product> findGreenerAlternatives(@Param("cat") String category,
                                          @Param("pid") Long productId,
                                          @Param("carbon") Double carbonFootprint);

    List<Product> findBySellerId(Long sellerId);
}
