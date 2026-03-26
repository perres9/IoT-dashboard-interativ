package com.iot.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> payload = new HashMap<>();
        payload.put("status", "UP"); // Standard health semantic used by infrastructure checks.
        payload.put("service", "iot-backend-java");
        payload.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(payload);
    }
}
