package com.iot.backend.websocket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iot.backend.model.SensorDataPayload;
import com.iot.backend.service.SensorStateService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SensorWebSocketHandler extends TextWebSocketHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(SensorWebSocketHandler.class);

    private final Set<WebSocketSession> sessions = ConcurrentHashMap.newKeySet();
    private final ObjectMapper objectMapper;
    private final SensorStateService sensorStateService;

    public SensorWebSocketHandler(ObjectMapper objectMapper, SensorStateService sensorStateService) {
        this.objectMapper = objectMapper;
        this.sensorStateService = sensorStateService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session); // Tracks live sessions for fan-out broadcast.
        LOGGER.info("WebSocket connected: {}", session.getId());

        String snapshot = objectMapper.writeValueAsString(sensorStateService.getAllLatest());
        session.sendMessage(new TextMessage(snapshot)); // Sends initial state so UI starts populated.
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session); // Prevents writes to closed sessions.
        LOGGER.info("WebSocket disconnected: {} with status {}", session.getId(), status);
    }

    public void broadcastSensorData(SensorDataPayload payload) {
        try {
            String json = objectMapper.writeValueAsString(payload);
            TextMessage message = new TextMessage(json);

            for (WebSocketSession session : sessions) {
                if (session.isOpen()) {
                    session.sendMessage(message); // Single serialized payload reused for performance.
                }
            }
        } catch (JsonProcessingException e) {
            LOGGER.error("Unable to serialize sensor payload for broadcast", e);
        } catch (IOException e) {
            LOGGER.error("I/O error while broadcasting to WebSocket clients", e);
        }
    }
}
