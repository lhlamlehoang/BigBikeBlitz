package com.example.backend.model;

import jakarta.persistence.*;
import java.util.Objects;
import java.time.LocalDate;

@Entity
@Table(name = "bikes")
public class Bike {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Double price;
    private String image;
    private String brand;
    private String type;
    private String year;
    private String capacity;
    private String driveMode;
    private String technology;
    private String description;

    public Bike() {}
    public Bike(Long id, String name, Double price, String image, String brand, String type, String year, String capacity, String driveMode, String technology, String description) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.brand = brand;
        this.type = type;
        this.year = year;
        this.capacity = capacity;
        this.driveMode = driveMode;
        this.technology = technology;
        this.description = description;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }
    public String getCapacity() { return capacity; }
    public void setCapacity(String capacity) { this.capacity = capacity; }
    public String getDriveMode() { return driveMode; }
    public void setDriveMode(String driveMode) { this.driveMode = driveMode; }
    public String getTechnology() { return technology; }
    public void setTechnology(String technology) { this.technology = technology; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Bike bike = (Bike) o;
        return Objects.equals(id, bike.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
} 