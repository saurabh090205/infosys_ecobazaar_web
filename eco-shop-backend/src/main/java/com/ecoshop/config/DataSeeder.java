package com.ecoshop.config;

import com.ecoshop.model.Product;
import com.ecoshop.model.Role;
import com.ecoshop.model.User;
import com.ecoshop.repository.ProductRepository;
import com.ecoshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedProducts();
        log.info("✅ Seed data loaded: {} users, {} products", userRepository.count(), productRepository.count());
    }

    private void seedUsers() {
        if (userRepository.count() > 0) return;

        userRepository.save(User.builder()
                .username("admin").email("admin@ecoshop.com")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN).fullName("Admin User").build());

        userRepository.save(User.builder()
                .username("seller1").email("seller@ecoshop.com")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.SELLER).fullName("Green Seller").build());

        userRepository.save(User.builder()
                .username("demouser").email("demo@ecoshop.com")
                .password(passwordEncoder.encode("demo123"))
                .role(Role.USER).fullName("Demo User").build());
    }

    private void seedProducts() {
        if (productRepository.count() > 0) return;

        Long sellerId = userRepository.findByUsername("seller1").map(User::getId).orElse(2L);

        // ── Clothing ──
        productRepository.save(Product.builder()
                .name("Organic Cotton T-Shirt")
                .description("Made from 100% GOTS-certified organic cotton. Grown without synthetic pesticides or fertilizers, using 91% less water than conventional cotton.")
                .price(29.99).imageUrl("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400")
                .category("Clothing").ecoRating(5).carbonFootprintKg(2.1).isEcoFriendly(true).sellerId(sellerId).stock(150).build());

        productRepository.save(Product.builder()
                .name("Recycled Polyester Jacket")
                .description("Performance jacket crafted from 100% recycled ocean plastic. Each jacket removes 12 plastic bottles from the ocean.")
                .price(89.99).imageUrl("https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400")
                .category("Clothing").ecoRating(4).carbonFootprintKg(5.8).isEcoFriendly(true).sellerId(sellerId).stock(75).build());

        productRepository.save(Product.builder()
                .name("Fast Fashion Hoodie")
                .description("Standard cotton-polyester blend hoodie. Conventional manufacturing process.")
                .price(19.99).imageUrl("https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400")
                .category("Clothing").ecoRating(2).carbonFootprintKg(12.5).isEcoFriendly(false).sellerId(sellerId).stock(200).build());

        // ── Home & Living ──
        productRepository.save(Product.builder()
                .name("Bamboo Utensil Set")
                .description("Reusable bamboo utensils with carrying case. Replaces single-use plastic cutlery. Bamboo is one of the fastest-growing and most sustainable materials.")
                .price(14.99).imageUrl("https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400")
                .category("Home").ecoRating(5).carbonFootprintKg(0.3).isEcoFriendly(true).sellerId(sellerId).stock(300).build());

        productRepository.save(Product.builder()
                .name("Beeswax Food Wraps")
                .description("Set of 3 reusable beeswax wraps replacing plastic cling film. Lasts up to 1 year with proper care. Compostable at end of life.")
                .price(18.99).imageUrl("https://images.unsplash.com/photo-1611068645682-99c331f4e6eb?w=400")
                .category("Home").ecoRating(5).carbonFootprintKg(0.5).isEcoFriendly(true).sellerId(sellerId).stock(180).build());

        productRepository.save(Product.builder()
                .name("Plastic Storage Containers (6-Pack)")
                .description("Standard BPA-free plastic containers for food storage.")
                .price(12.99).imageUrl("https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400")
                .category("Home").ecoRating(2).carbonFootprintKg(4.2).isEcoFriendly(false).sellerId(sellerId).stock(250).build());

        // ── Personal Care ──
        productRepository.save(Product.builder()
                .name("Shampoo Bar – Zero Waste")
                .description("Concentrated shampoo bar equivalent to 3 bottles of liquid shampoo. Palm-oil free, cruelty-free, and plastic-free packaging.")
                .price(12.99).imageUrl("https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400")
                .category("Personal Care").ecoRating(5).carbonFootprintKg(0.2).isEcoFriendly(true).sellerId(sellerId).stock(400).build());

        productRepository.save(Product.builder()
                .name("Bamboo Toothbrush Set (4-Pack)")
                .description("Biodegradable bamboo toothbrushes with BPA-free nylon bristles. Handle decomposes in under 6 months.")
                .price(9.99).imageUrl("https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400")
                .category("Personal Care").ecoRating(4).carbonFootprintKg(0.4).isEcoFriendly(true).sellerId(sellerId).stock(500).build());

        productRepository.save(Product.builder()
                .name("Regular Plastic Toothbrush (3-Pack)")
                .description("Standard nylon-bristle toothbrush with plastic handle.")
                .price(4.99).imageUrl("https://images.unsplash.com/photo-1559650656-5d1d361ad10e?w=400")
                .category("Personal Care").ecoRating(1).carbonFootprintKg(1.8).isEcoFriendly(false).sellerId(sellerId).stock(600).build());

        // ── Electronics ──
        productRepository.save(Product.builder()
                .name("Solar Power Bank (20000mAh)")
                .description("Portable solar-powered charger with dual USB output. Manufactured using recycled aluminum housing and conflict-free minerals.")
                .price(49.99).imageUrl("https://images.unsplash.com/photo-1594535182308-8ffefbb661e1?w=400")
                .category("Electronics").ecoRating(4).carbonFootprintKg(8.5).isEcoFriendly(true).sellerId(sellerId).stock(100).build());

        productRepository.save(Product.builder()
                .name("Standard Power Bank (10000mAh)")
                .description("Lithium-ion portable charger with standard plastic housing.")
                .price(24.99).imageUrl("https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400")
                .category("Electronics").ecoRating(2).carbonFootprintKg(14.0).isEcoFriendly(false).sellerId(sellerId).stock(200).build());

        // ── Food & Drink ──
        productRepository.save(Product.builder()
                .name("Stainless Steel Water Bottle")
                .description("Double-walled vacuum insulated. Keeps drinks cold 24h / hot 12h. Replaces ~1,500 single-use plastic bottles over its lifetime.")
                .price(34.99).imageUrl("https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400")
                .category("Food & Drink").ecoRating(5).carbonFootprintKg(1.8).isEcoFriendly(true).sellerId(sellerId).stock(250).build());
    }
}
