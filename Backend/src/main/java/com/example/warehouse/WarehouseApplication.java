package com.example.warehouse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories("com.example.warehouse.repository")
public class WarehouseApplication {

    public static void main(String[] args) {
        SpringApplication.run(WarehouseApplication.class, args);
    }
}
