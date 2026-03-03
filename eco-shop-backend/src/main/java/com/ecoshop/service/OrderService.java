package com.ecoshop.service;

import com.ecoshop.dto.CheckoutRequest;
import com.ecoshop.dto.OrderResponse;
import com.ecoshop.model.*;
import com.ecoshop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final CartService cartService;

    @Transactional
    public OrderResponse checkout(Long userId, CheckoutRequest request) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = Order.builder()
                .userId(userId)
                .totalPrice(0.0)
                .totalCarbonFootprint(0.0)
                .status("CONFIRMED")
                .shippingAddress(request.getShippingAddress())
                .build();

        double totalPrice = 0;
        double totalCarbon = 0;

        for (CartItem cartItem : cartItems) {
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            double itemPrice = product.getPrice() * cartItem.getQuantity();
            double itemCarbon = product.getCarbonFootprintKg() * cartItem.getQuantity();

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .productId(product.getId())
                    .quantity(cartItem.getQuantity())
                    .priceAtPurchase(product.getPrice())
                    .carbonAtPurchase(product.getCarbonFootprintKg())
                    .build();

            order.getItems().add(orderItem);
            totalPrice += itemPrice;
            totalCarbon += itemCarbon;
        }

        order.setTotalPrice(Math.round(totalPrice * 100.0) / 100.0);
        order.setTotalCarbonFootprint(Math.round(totalCarbon * 100.0) / 100.0);

        orderRepository.save(order);
        cartService.clearCart(userId);

        return mapToResponse(order);
    }

    public List<OrderResponse> getOrderHistory(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderResponse.OrderItemDetail> items = order.getItems().stream().map(item -> {
            String productName = productRepository.findById(item.getProductId())
                    .map(Product::getName)
                    .orElse("Unknown Product");
            return OrderResponse.OrderItemDetail.builder()
                    .productId(item.getProductId())
                    .productName(productName)
                    .quantity(item.getQuantity())
                    .priceAtPurchase(item.getPriceAtPurchase())
                    .carbonAtPurchase(item.getCarbonAtPurchase())
                    .build();
        }).toList();

        return OrderResponse.builder()
                .id(order.getId())
                .totalPrice(order.getTotalPrice())
                .totalCarbonFootprint(order.getTotalCarbonFootprint())
                .status(order.getStatus())
                .shippingAddress(order.getShippingAddress())
                .createdAt(order.getCreatedAt())
                .items(items)
                .build();
    }
}
