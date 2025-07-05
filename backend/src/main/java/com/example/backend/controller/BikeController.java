package com.example.backend.controller;

import com.example.backend.model.Bike;
import com.example.backend.repository.BikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bikes")
public class BikeController {
    @Autowired
    private BikeRepository bikeRepository;

    @GetMapping("/all")
    public List<Bike> getBikes() {
        return bikeRepository.findAll();
    }

    @GetMapping("/{id}")
    public Bike getBike(@PathVariable Long id) {
        return bikeRepository.findById(id).orElseThrow();
    }

    @PostMapping("")
    public Bike createBike(@RequestBody Bike bike) {
        return bikeRepository.save(bike);
    }

    @PutMapping("/{id}")
    public Bike updateBike(@PathVariable Long id, @RequestBody Bike bike) {
        Bike existing = bikeRepository.findById(id).orElseThrow();
        existing.setName(bike.getName());
        existing.setPrice(bike.getPrice());
        existing.setImage(bike.getImage());
        existing.setBrand(bike.getBrand());
        existing.setType(bike.getType());
        return bikeRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void deleteBike(@PathVariable Long id) {
        bikeRepository.deleteById(id);
    }
} 