package com.iot.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication // Enables component scan, auto-configuration and configuration properties.
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args); // Bootstraps the API server and all integrations.
    }
}
