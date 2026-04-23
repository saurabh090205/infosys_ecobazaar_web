package com.ecoshop.service;

import com.ecoshop.dto.CartItemRequest;
import com.ecoshop.dto.CartResponse;
import com.ecoshop.model.CartItem;
import com.ecoshop.model.Product;
import com.ecoshop.repository.CartItemRepository;
import com.ecoshop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartResponse getCart(Long userId) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);

        List<CartResponse.CartItemDetail> details = cartItems.stream().map(item -> {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            return CartResponse.CartItemDetail.builder()
                    .id(item.getId())
                    .productId(product.getId())
                    .productName(product.getName())
                    .productImage(product.getImageUrl())
                    .productPrice(product.getPrice())
                    .carbonFootprintKg(product.getCarbonFootprintKg())
                    .ecoRating(product.getEcoRating())
                    .quantity(item.getQuantity())
                    .subtotal(product.getPrice() * item.getQuantity())
                    .carbonSubtotal(product.getCarbonFootprintKg() * item.getQuantity())
                    .build();
        }).toList();

        double totalPrice = details.stream().mapToDouble(CartResponse.CartItemDetail::getSubtotal).sum();
        double totalCarbon = details.stream().mapToDouble(CartResponse.CartItemDetail::getCarbonSubtotal).sum();

        return CartResponse.builder()
                .items(details)
                .totalPrice(Math.round(totalPrice * 100.0) / 100.0)
                .totalCarbonFootprint(Math.round(totalCarbon * 100.0) / 100.0)
                .totalItems(details.stream().mapToInt(CartResponse.CartItemDetail::getQuantity).sum())
                .build();
    }

    public CartItem addToCart(Long userId, CartItemRequest request) {
        Optional<CartItem> existing = cartItemRepository.findByUserIdAndProductId(userId, request.getProductId());

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + (request.getQuantity() != null ? request.getQuantity() : 1));
            return cartItemRepository.save(item);
        }

        CartItem newItem = CartItem.builder()
                .userId(userId)
                .productId(request.getProductId())
                .quantity(request.getQuantity() != null ? request.getQuantity() : 1)
                .build();
        return cartItemRepository.save(newItem);
    }

    public CartItem updateCartItem(Long itemId, Integer quantity) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

    public void removeCartItem(Long itemId) {
        cartItemRepository.deleteById(itemId);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }
}
