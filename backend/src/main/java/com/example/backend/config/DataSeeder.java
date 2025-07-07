package com.example.backend.config;

import com.example.backend.model.Bike;
import com.example.backend.model.User;
import com.example.backend.repository.BikeRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {
    @Bean
    public CommandLineRunner seedBikes(BikeRepository bikeRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (bikeRepository.count() == 0) {
                bikeRepository.save(new Bike(null, "BMW F 900 R", 9995.0, "/uploads/bmw-f900-r.jpg", "BMW", "Naked", "2021", "895cc", "Chain", "Dynamic ESA, ABS Pro", "A dynamic roadster offering agile handling and a powerful parallel-twin engine, perfect for spirited rides."));
                bikeRepository.save(new Bike(null, "BMW G 310 R", 5495.0, "/uploads/bmw-g310-r.jpg", "BMW", "Naked", "2022", "313cc", "Chain", "ABS", "A lightweight and nimble roadster, ideal for urban commuting and new riders, with BMW quality."));
                bikeRepository.save(new Bike(null, "BMW R 1250 GS", 17995.0, "/uploads/bmw-r1250-gs.jpg", "BMW", "Adventure", "2023", "1254cc", "Shaft", "Dynamic ESA, Hill Start Control", "The benchmark adventure touring motorcycle, renowned for its versatility, comfort, and off-road capability."));
                bikeRepository.save(new Bike(null, "BMW S 1000 RR", 16995.0, "/uploads/bmw-s1000-rr.jpg", "BMW", "Sport", "2020", "999cc", "Chain", "DTC, Shift Assistant Pro", "A high-performance superbike designed for the track and road, featuring advanced electronics and a powerful inline-four engine."));
                bikeRepository.save(new Bike(null, "Honda CRF450R", 9599.0, "/uploads/honda-crf-450r.jpg", "Honda", "Off-Road", "2023", "449cc", "Chain", "Launch Control, HSTC", "A championship-winning motocross bike, offering exceptional power, handling, and durability for competitive riding."));
                bikeRepository.save(new Bike(null, "Honda Gold Wing", 23999.0, "/uploads/honda-goldwing.jpg", "Honda", "Touring", "2022", "1833cc", "Shaft", "DCT, Apple CarPlay", "The pinnacle of touring comfort and technology, designed for long-distance journeys with luxurious amenities."));
                bikeRepository.save(new Bike(null, "Honda Rebel 500", 6499.0, "/uploads/honda-rebel-500.jpg", "Honda", "Cruiser", "2023", "471cc", "Chain", "ABS", "A stylish and approachable cruiser, perfect for new riders or those seeking a lightweight and customizable urban ride."));
                bikeRepository.save(new Bike(null, "Kawasaki Ninja 400", 5299.0, "/uploads/kawasaki-ninja-400.jpg", "Kawasaki", "Sport", "2022", "399cc", "Chain", "ABS", "A lightweight and agile sportbike, ideal for new riders and city commuting, offering a thrilling and manageable performance."));
                bikeRepository.save(new Bike(null, "Suzuki GSX-R1000", 15599.0, "/uploads/suzuki-gsx-r1000.jpg", "Suzuki", "Sport", "2021", "999cc", "Chain", "Motion Track ABS, Quick Shift", "A legendary superbike known for its powerful engine, precise handling, and race-derived technology."));
                bikeRepository.save(new Bike(null, "Yamaha YZF-R1", 17999.0, "/uploads/yamaha-yzf-r1.jpg", "Yamaha", "Sport", "2023", "998cc", "Chain", "Traction Control, Slide Control", "A purebred supersport machine, directly inspired by MotoGP, offering thrilling performance and advanced rider aids."));
            }
            if (userRepository.count() == 0) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin"));
                admin.setRole("ADMIN");
                admin.setEnabled(true);
                admin.setEmail("admin@bigbikeblitz.com");
                admin.setPhone("1234567890");
                userRepository.save(admin);
            }
        };
    }
} 