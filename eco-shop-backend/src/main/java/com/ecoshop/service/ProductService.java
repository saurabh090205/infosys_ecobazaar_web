package com.ecoshop.service;

import com.ecoshop.dto.ProductRequest;
import com.ecoshop.model.Product;
import com.ecoshop.model.User;
import com.ecoshop.repository.ProductRepository;
import com.ecoshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    private Product populateSellerInfo(Product product) {
        if (product.getSellerId() != null) {
            userRepository.findById(product.getSellerId()).ifPresent(user -> {
                product.setStoreName(user.getFullName() != null && !user.getFullName().isBlank() ? user.getFullName() : user.getUsername());
                product.setIsSellerVerified(user.getIsVerified() != null ? user.getIsVerified() : false);
            });
        }
        return product;
    }

    private List<Product> populateSellerInfo(List<Product> products) {
        Set<Long> sellerIds = products.stream()
                .map(Product::getSellerId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        Map<Long, User> sellers = userRepository.findAllById(sellerIds).stream()
                .collect(Collectors.toMap(User::getId, u -> u));

        for (Product p : products) {
            if (p.getSellerId() != null && sellers.containsKey(p.getSellerId())) {
                User u = sellers.get(p.getSellerId());
                p.setStoreName(u.getFullName() != null && !u.getFullName().isBlank() ? u.getFullName() : u.getUsername());
                p.setIsSellerVerified(u.getIsVerified() != null ? u.getIsVerified() : false);
            }
        }
        return products;
    }

    public List<Product> getFilteredProducts(String search, String category, Boolean ecoFriendly, Long sellerId, String sortBy) {
        org.springframework.data.domain.Sort sort = org.springframework.data.domain.Sort.unsorted();
        if ("price_asc".equals(sortBy)) {
            sort = org.springframework.data.domain.Sort.by("price").ascending();
        } else if ("price_desc".equals(sortBy)) {
            sort = org.springframework.data.domain.Sort.by("price").descending();
        }
        return populateSellerInfo(productRepository.searchProductsWithFilters(search, category, ecoFriendly, sellerId, sort));
    }

    public Product getProductById(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return populateSellerInfo(p);
    }

    public List<Product> getGreenerAlternatives(Long productId) {
        Product product = getProductById(productId);
        List<Product> alternatives = productRepository.findGreenerAlternatives(
                product.getCategory(), productId, product.getCarbonFootprintKg());
        return populateSellerInfo(alternatives.stream().limit(4).toList());
    }

    public Product createProduct(ProductRequest request, Long sellerId) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .category(request.getCategory())
                .ecoRating(request.getEcoRating())
                .carbonFootprintKg(request.getCarbonFootprintKg())
                .isEcoFriendly(request.getIsEcoFriendly() != null ? request.getIsEcoFriendly() : request.getEcoRating() >= 4)
                .sellerId(sellerId)
                .stock(request.getStock())
                .build();
        return populateSellerInfo(productRepository.save(product));
    }

    public Product updateProduct(Long id, ProductRequest request, Long sellerId, String role) {
        Product product = getProductById(id);
        if (!"ADMIN".equals(role) && !product.getSellerId().equals(sellerId)) {
            throw new AccessDeniedException("You can only update your own products");
        }
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(request.getCategory());
        product.setEcoRating(request.getEcoRating());
        product.setCarbonFootprintKg(request.getCarbonFootprintKg());
        product.setIsEcoFriendly(request.getIsEcoFriendly() != null ? request.getIsEcoFriendly() : request.getEcoRating() >= 4);
        product.setStock(request.getStock());
        return populateSellerInfo(productRepository.save(product));
    }

    public void deleteProduct(Long id, Long sellerId, String role) {
        Product product = getProductById(id);
        if (!"ADMIN".equals(role) && !product.getSellerId().equals(sellerId)) {
            throw new AccessDeniedException("You can only delete your own products");
        }
        productRepository.deleteById(id);
    }

}
