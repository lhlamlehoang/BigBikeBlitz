package com.example.backend.controller;

import com.example.backend.model.Bike;
import com.example.backend.model.Cart;
import com.example.backend.model.CartItem;
import com.example.backend.model.User;
import com.example.backend.repository.BikeRepository;
import com.example.backend.repository.CartRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BikeRepository bikeRepository;

    @PostMapping("/add")
    public Cart addToCart(Authentication auth, @RequestBody Map<String, Object> payload) {
        String username = auth.getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found: " + username));
        Long bikeId = Long.valueOf(payload.get("bikeId").toString());
        int quantity = payload.get("quantity") != null ? Integer.parseInt(payload.get("quantity").toString()) : 1;
        Bike bike = bikeRepository.findById(bikeId)
            .orElseThrow(() -> new RuntimeException("Bike not found: ID = " + bikeId));

        Cart cart = cartRepository.findByUserId(user.getId()).orElseGet(() -> {
            Cart c = new Cart();
            c.setUserId(user.getId());
            c.setCartItems(new ArrayList<>());
            return c;
        });
        boolean found = false;
        for (CartItem item : cart.getCartItems()) {
            if (item.getBike().getId().equals(bikeId)) {
                item.setQuantity(quantity);
                found = true;
                break;
            }
        }
        if (!found) {
            CartItem newItem = new CartItem();
            newItem.setBike(bike);
            newItem.setQuantity(quantity);
            newItem.setAddedAt(LocalDateTime.now());
            cart.getCartItems().add(newItem);
        }
        cart.getCartItems().sort((a, b) -> a.getAddedAt().compareTo(b.getAddedAt()));
        return cartRepository.save(cart);
    }

    @GetMapping
    public Cart viewCart(Authentication auth) {
        String username = auth.getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        Cart cart = cartRepository.findByUserId(user.getId()).orElseGet(() -> {
            Cart c = new Cart();
            c.setUserId(user.getId());
            c.setCartItems(new ArrayList<>());
            return c;
        });
        cart.getCartItems().sort((a, b) -> a.getAddedAt().compareTo(b.getAddedAt()));
        return cart;
    }

    @PostMapping("/remove")
    public Cart removeFromCart(Authentication auth, @RequestBody Map<String, Object> payload) {
        String username = auth.getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        Long bikeId = Long.valueOf(payload.get("bikeId").toString());
        Cart cart = cartRepository.findByUserId(user.getId()).orElseThrow();
        Iterator<CartItem> iterator = cart.getCartItems().iterator();
        while (iterator.hasNext()) {
            CartItem item = iterator.next();
            if (item.getBike().getId().equals(bikeId)) {
                iterator.remove();
                break;
            }
        }
        return cartRepository.save(cart);
    }
} 