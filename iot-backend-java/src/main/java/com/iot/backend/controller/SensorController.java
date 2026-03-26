package com.iot.backend.controller;

import com.iot.backend.model.SensorDataPayload;
import com.iot.backend.service.SensorIngestionService;
import com.iot.backend.service.SensorStateService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/sensors")
@Validated
public class SensorController {

    private final SensorStateService sensorStateService;
    private final SensorIngestionService sensorIngestionService;

    public SensorController(SensorStateService sensorStateService, SensorIngestionService sensorIngestionService) {
        this.sensorStateService = sensorStateService;
        this.sensorIngestionService = sensorIngestionService;
    }

    @GetMapping
    public ResponseEntity<List<SensorDataPayload>> getAllLatest() {
        return ResponseEntity.ok(sensorStateService.getAllLatest()); // Returns compact snapshot for dashboard hydration.
    }

    @GetMapping("/{sensorId}")
    public ResponseEntity<SensorDataPayload> getLatestById(@PathVariable String sensorId) {
        SensorDataPayload payload = sensorStateService.getLatestById(sensorId);

        if (payload == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(payload);
    }

    @GetMapping("/{sensorId}/history")
    public ResponseEntity<List<SensorDataPayload>> getHistory(@PathVariable String sensorId,
                                                              @RequestParam(defaultValue = "50") int limit) {
        return ResponseEntity.ok(sensorStateService.getHistory(sensorId, limit));
    }

    @PostMapping("/ingest")
    public ResponseEntity<SensorDataPayload> ingest(@Valid @RequestBody SensorDataPayload payload) {
        // Ensures a valid timestamp when source does not provide one.
        if (payload.getTimestamp() == null || payload.getTimestamp() <= 0L) {
            payload.setTimestamp(System.currentTimeMillis());
        }

        SensorDataPayload ingested = sensorIngestionService.ingest(payload);
        return ResponseEntity.status(HttpStatus.CREATED).body(ingested);
    }
}
