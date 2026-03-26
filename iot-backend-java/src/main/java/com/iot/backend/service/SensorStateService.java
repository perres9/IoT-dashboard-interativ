package com.iot.backend.service;

import com.iot.backend.model.SensorDataPayload;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Deque;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SensorStateService {

    private final Map<String, SensorDataPayload> latestBySensor = new ConcurrentHashMap<>();
    private final Map<String, Deque<SensorDataPayload>> historyBySensor = new ConcurrentHashMap<>();

    private final int maxHistoryPerSensor;

    public SensorStateService(@Value("${iot.history.max-per-sensor:500}") int maxHistoryPerSensor) {
        this.maxHistoryPerSensor = maxHistoryPerSensor;
    }

    public SensorDataPayload upsert(SensorDataPayload payload) {
        latestBySensor.put(payload.getSensorId(), payload); // Stores latest point for status cards.

        Deque<SensorDataPayload> history = historyBySensor.computeIfAbsent(payload.getSensorId(), key -> new ArrayDeque<>());
        history.addLast(payload); // Appends new point preserving chronological order.

        while (history.size() > maxHistoryPerSensor) {
            history.removeFirst(); // Enforces bounded memory usage in long-running sessions.
        }

        return payload;
    }

    public List<SensorDataPayload> getAllLatest() {
        return new ArrayList<>(latestBySensor.values());
    }

    public SensorDataPayload getLatestById(String sensorId) {
        return latestBySensor.get(sensorId);
    }

    public List<SensorDataPayload> getHistory(String sensorId, int limit) {
        Deque<SensorDataPayload> history = historyBySensor.get(sensorId);

        if (history == null || history.isEmpty()) {
            return Collections.emptyList();
        }

        List<SensorDataPayload> asList = new ArrayList<>(history);
        if (limit <= 0 || limit >= asList.size()) {
            return asList;
        }

        return asList.subList(asList.size() - limit, asList.size()); // Returns most recent N readings.
    }
}
