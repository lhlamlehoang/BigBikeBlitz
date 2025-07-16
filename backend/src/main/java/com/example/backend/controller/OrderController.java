package com.example.backend.controller;

import com.example.backend.model.Order;
import com.example.backend.model.Cart;
import com.example.backend.model.CartItem;
import com.example.backend.model.User;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.CartRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/place")
    public Order placeOrder(Authentication auth, @RequestBody Map<String, Object> payload) {
        String username = auth.getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        if (user.getAddress() == null || user.getAddress().trim().isEmpty()) {
            throw new RuntimeException("Address is required to place an order");
        }
        if (user.getPhone() == null || user.getPhone().trim().isEmpty()) {
            throw new RuntimeException("Phone is required to place an order");
        }
        Cart cart = cartRepository.findByUserId(user.getId()).orElseThrow();
        if (cart.getCartItems().isEmpty()) throw new RuntimeException("Cart is empty");
        String paymentMethod = (String) payload.getOrDefault("paymentMethod", "Bank Transfer");
        String shippingMethod = (String) payload.getOrDefault("shippingMethod", "Standard");
        LocalDate shipDate = LocalDate.now().plusDays(3);
        double total = cart.getCartItems().stream().mapToDouble(item -> (item.getBike().getPrice() != null ? item.getBike().getPrice() : 0) * item.getQuantity()).sum();
        Order order = new Order();
        order.setUserId(user.getId());
        order.setAddress(user.getAddress());
        order.setPhone(user.getPhone());
        List<CartItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cart.getCartItems()) {
            CartItem orderItem = new CartItem();
            orderItem.setBike(cartItem.getBike());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItems.add(orderItem);
        }
        order.setOrderItems(orderItems);
        order.setOrderDate(LocalDate.now());
        order.setShipDate(shipDate);
        order.setPaymentMethod(paymentMethod);
        order.setShippingMethod(shippingMethod);
        order.setTotal(total);
        orderRepository.save(order);
        cart.getCartItems().clear();
        cartRepository.save(cart);
        return order;
    }

    @GetMapping
    public List<Order> getOrders(Authentication auth) {
        String username = auth.getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        return orderRepository.findByUserId(user.getId());
    }
} 