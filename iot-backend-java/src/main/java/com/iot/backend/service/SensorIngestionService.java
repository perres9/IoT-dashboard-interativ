package com.iot.backend.service;

import com.iot.backend.model.SensorDataPayload;
import com.iot.backend.websocket.SensorWebSocketHandler;
import org.springframework.stereotype.Service;

@Service
public class SensorIngestionService {

    private final SensorStateService sensorStateService;
    private final SensorWebSocketHandler sensorWebSocketHandler;

    public SensorIngestionService(SensorStateService sensorStateService, SensorWebSocketHandler sensorWebSocketHandler) {
        this.sensorStateService = sensorStateService;
        this.sensorWebSocketHandler = sensorWebSocketHandler;
    }

    public SensorDataPayload ingest(SensorDataPayload payload) {
        SensorDataPayload stored = sensorStateService.upsert(payload); // Writes canonical state before broadcasting.
        sensorWebSocketHandler.broadcastSensorData(stored); // Pushes update immediately to connected dashboards.
        return stored;
    }
}
