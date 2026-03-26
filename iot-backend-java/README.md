# IoT Backend Java (Spring Boot)

desenvolvido por: perres9

Backend profissional para o dashboard IoT anterior, com REST API, stream em tempo real via WebSocket e ingestao opcional via MQTT.

## Stack

- Java 8
- Spring Boot 2.7
- Spring Web
- Spring WebSocket
- Spring Integration MQTT
- H2 (desenvolvimento)

## Como executar

1. Entre na pasta do projeto:

```bash
cd iot-backend-java
```

1. Rode a aplicacao:

```bash
mvn spring-boot:run
```

1. Endpoints base:

- REST: `http://localhost:8080/api`
- WebSocket: `ws://localhost:8080/ws/sensors`
- Health: `http://localhost:8080/api/health`

## Endpoints REST

- `GET /api/sensors` -> snapshot com ultimo valor por sensor.
- `GET /api/sensors/{sensorId}` -> ultimo valor de um sensor.
- `GET /api/sensors/{sensorId}/history?limit=50` -> historico recente.
- `POST /api/sensors/ingest` -> injeta leitura e dispara broadcast.

Exemplo de payload para ingestao:

```json
{
  "sensorId": "sensor-001",
  "value": 23.7,
  "timestamp": 1711400000000,
  "unit": "C",
  "type": "TEMPERATURE",
  "location": "sala",
  "status": "online"
}
```

## Integracao com o dashboard Next.js

No frontend, use o WebSocket em `ws://localhost:8080/ws/sensors`.

Passos sugeridos:

1. Inicialize o estado com `GET /api/sensors`.
2. Abra socket em `/ws/sensors`.
3. Atualize os graficos quando chegar cada nova mensagem.

## MQTT

Por padrao o MQTT vem desabilitado (`iot.mqtt.enabled=false`) para facilitar desenvolvimento local.

Para ativar:

1. Em `application.properties`, altere `iot.mqtt.enabled=true`.
2. Ajuste broker, topic e client id.
3. Envie mensagens JSON no formato do payload acima.

## Observabilidade

- Health: `/actuator/health`
- Info: `/actuator/info`
- Metrics: `/actuator/metrics`

## Estudo do codigo

As classes principais possuem comentarios em pontos criticos para explicar:

- Por que cada componente existe.
- Onde o estado fica.
- Como o broadcast e feito.
- Como o fluxo REST e MQTT converge para a mesma pipeline de ingestao.

desenvolvido por: perres9
