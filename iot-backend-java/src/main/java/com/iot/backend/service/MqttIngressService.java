package com.iot.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iot.backend.model.SensorDataPayload;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.core.MessageProducer;
import org.springframework.integration.mqtt.core.DefaultMqttPahoClientFactory;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.support.DefaultPahoMessageConverter;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;

@Configuration
public class MqttIngressService {

    private static final Logger LOGGER = LoggerFactory.getLogger(MqttIngressService.class);

    @Value("${iot.mqtt.enabled:false}")
    private boolean mqttEnabled;

    @Value("${iot.mqtt.url:tcp://broker.hivemq.com:1883}")
    private String brokerUrl;

    @Value("${iot.mqtt.client-id:iot-backend-java-client}")
    private String clientId;

    @Value("${iot.mqtt.topic:iot/sensors/+/data}")
    private String topic;

    private final ObjectMapper objectMapper;
    private final SensorIngestionService sensorIngestionService;

    public MqttIngressService(ObjectMapper objectMapper, SensorIngestionService sensorIngestionService) {
        this.objectMapper = objectMapper;
        this.sensorIngestionService = sensorIngestionService;
    }

    @Bean
    public MqttPahoClientFactory mqttClientFactory() {
        DefaultMqttPahoClientFactory factory = new DefaultMqttPahoClientFactory();
        MqttConnectOptions options = new MqttConnectOptions();
        options.setServerURIs(new String[]{brokerUrl}); // Central place to swap brokers between environments.
        factory.setConnectionOptions(options);
        return factory;
    }

    @Bean
    public MessageChannel mqttInputChannel() {
        return new DirectChannel(); // Direct channel keeps flow synchronous and simple for this use case.
    }

    @Bean
    public MessageProducer inbound() {
        MqttPahoMessageDrivenChannelAdapter adapter =
                new MqttPahoMessageDrivenChannelAdapter(clientId, mqttClientFactory(), topic);
        adapter.setCompletionTimeout(5000);
        adapter.setConverter(new DefaultPahoMessageConverter());
        adapter.setQos(1);
        adapter.setOutputChannel(mqttInputChannel());
        adapter.setAutoStartup(mqttEnabled); // Controlled by config so local dev can run without broker.
        return adapter;
    }

    @Bean
    @ServiceActivator(inputChannel = "mqttInputChannel")
    public MessageHandler handler() {
        return message -> {
            try {
                String payloadAsJson = String.valueOf(message.getPayload());
                SensorDataPayload payload = objectMapper.readValue(payloadAsJson, SensorDataPayload.class);

                if (payload.getTimestamp() == null || payload.getTimestamp() <= 0L) {
                    payload.setTimestamp(System.currentTimeMillis());
                }

                sensorIngestionService.ingest(payload); // Reuses same ingestion pipeline as REST endpoint.
            } catch (Exception ex) {
                LOGGER.error("Failed to ingest MQTT payload", ex);
            }
        };
    }
}
