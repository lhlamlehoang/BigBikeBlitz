package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.model.Bike;
import com.example.backend.model.Order;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.BikeRepository;
import com.example.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BikeRepository bikeRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    // USERS CRUD
    @GetMapping("/users")
    public List<User> getUsers() { return userRepository.findAll(); }

    @PostMapping("/users")
    public User addUser(@RequestBody User user) {
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Password is required for new users");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        } else {
            // Keep the old password if not provided
            String oldPassword = userRepository.findById(id).map(User::getPassword).orElse(null);
            user.setPassword(oldPassword);
        }
        return userRepository.save(user);
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) { userRepository.deleteById(id); }

    // BIKES CRUD
    @GetMapping("/bikes")
    public List<Bike> getBikes() { return bikeRepository.findAll(); }

    @PostMapping("/bikes")
    public Bike addBike(@RequestBody Bike bike) { return bikeRepository.save(bike); }

    @PutMapping("/bikes/{id}")
    public Bike updateBike(@PathVariable Long id, @RequestBody Bike bike) {
        bike.setId(id);
        return bikeRepository.save(bike);
    }

    @DeleteMapping("/bikes/{id}")
    public void deleteBike(@PathVariable Long id) { bikeRepository.deleteById(id); }

    // ORDERS CRUD
    @GetMapping("/orders")
    public List<Order> getOrders() { return orderRepository.findAll(); }

    @DeleteMapping("/orders/{id}")
    public void deleteOrder(@PathVariable Long id) { orderRepository.deleteById(id); }

    @PutMapping("/orders/{id}/status")
    public Order updateOrderStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        Order order = orderRepository.findById(id).orElseThrow();
        String status = body.get("status");
        if (status != null) {
            order.setStatus(status);
            orderRepository.save(order);
        }
        return order;
    }
} 