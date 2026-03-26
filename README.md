# IoT Dashboard - Fullstack 

**Desenvolvido por:** perres9

Um projeto completo de **monitoramento de sensores IoT em tempo real** com dashboard moderno em Next.js e backend robusto em Spring Boot. Arquitetura fullstack integrada com suporte a WebSocket, MQTT e persistência de dados.

## Destaques

- **Frontend Responsivo**: Next.js 16 + React 19 + TypeScript 5 com tema escuro/claro
- **Backend Escalável**: Spring Boot 2.7 com WebSocket, MQTT e REST API
- **Tempo Real**: WebSocket bidirecional para atualizações instantâneas de sensores
- **Design Elegante**: Paleta de cores quentes, Glass Morphism, animações suaves
- **Segurança**: Variáveis de ambiente parametrizadas, .gitignore robusto, sem credenciais em código
- **Tipo Seguro**: TypeScript no frontend, Java com Spring no backend

---

## Estrutura do Monorepo

```
iot-dashboard/
├── src/                                 # Frontend Next.js
│   ├── app/
│   │   ├── layout.tsx                  # Layout raiz com Sensor Provider
│   │   ├── page.tsx                    # Dashboard principal
│   │   └── globals.css                 # Sistema de temas e utilitários globais
│   ├── components/
│   │   ├── Dashboard.tsx               # Orquestrador principal com theme toggle
│   │   ├── SensorCard.tsx              # Card individual com trending
│   │   ├── SensorChart.tsx             # Gráfico interativo com Recharts
│   │   └── StatusBadge.tsx             # Indicador online/offline
│   ├── context/
│   │   └── SensorContext.tsx           # Gerenciamento global de sensores
│   ├── hooks/
│   │   └── useWebSocket.ts             # WebSocket com reconexão automática
│   ├── types/
│   │   └── sensor.ts                   # Tipos e interfaces TypeScript
│   └── utils/
│       └── mockData.ts                 # Gerador de dados para teste
│
├── iot-backend-java/                    # Backend Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/iot/backend/
│   │   │   │   ├── Application.java                    # Ponto de entrada
│   │   │   │   ├── config/
│   │   │   │   │   ├── CorsConfig.java               # CORS para frontend
│   │   │   │   │   └── WebSocketConfig.java          # Configuração WebSocket
│   │   │   │   ├── controller/
│   │   │   │   │   ├── HealthController.java         # Health check endpoint
│   │   │   │   │   └── SensorController.java         # API REST de sensores
│   │   │   │   ├── model/
│   │   │   │   │   ├── SensorDataPayload.java        # DTO para payloads
│   │   │   │   │   └── SensorType.java               # Enumeração de tipos
│   │   │   │   ├── service/
│   │   │   │   │   ├── MqttIngressService.java       # Listener MQTT
│   │   │   │   │   ├── SensorIngestionService.java   # Processamento de dados
│   │   │   │   │   └── SensorStateService.java       # Gerenciador de estado
│   │   │   │   └── websocket/
│   │   │   │       └── SensorWebSocketHandler.java    # Handler WebSocket
│   │   │   └── resources/
│   │   │       └── application.properties             # Config parametrizada
│   │   └── test/
│   │       └── java/.../ApplicationContextTest.java   # Testes de contexto
│   ├── pom.xml                                         # Dependências Maven
│   └── .gitignore                                      # Ignora build, IDE, segurança
│
├── .env.example                         # Template de variáveis frontend
├── iot-backend-java/.env.example       # Template de variáveis backend
├── pom.xml                              # Root POM (opcional para multi-module)
├── .gitignore                           # Ignora node_modules, build, IDE
└── README.md                            # Você está aqui!
```

---

## Quick Start

### Pré-requisitos

- **Node.js** 20+ (para frontend)
- **Java** 11+ (para backend)
- **Maven** 3.8+ (para build Java)
- **npm/yarn** (gerenciador de pacotes)

### 1. Configurar Variáveis de Ambiente

**Frontend:**

```bash
cp .env.example .env.local
```

Edite `.env.local`:

```
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws/sensors
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

**Backend:**

```bash
cd iot-backend-java
cp .env.example .env.local
```

Edite `.env.local`:

```
DB_USERNAME=sa
DB_PASSWORD=password
IOT_MQTT_URL=tcp://broker.hivemq.com:1883
IOT_MQTT_USERNAME=
IOT_MQTT_PASSWORD=
```

### 2. Executar Backend

```bash
cd iot-backend-java
mvn clean install
mvn spring-boot:run
```

Ou com variáveis de ambiente:

```bash
export DB_USERNAME=sa && export DB_PASSWORD=password
mvn spring-boot:run
```

Backend rodará em: `http://localhost:8080`

### 3. Executar Frontend

```bash
# Na raiz do projeto
npm install
npm run dev
```

Frontend rodará em: `http://localhost:3000`

---

## Endpoints API

### REST Endpoints (Backend)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/health` | Status do servidor |
| `GET` | `/api/sensors` | Lista todos os sensores |
| `GET` | `/api/sensors/{id}` | Detalhes de um sensor |
| `POST` | `/api/sensors/reading` | Registrar leitura |
| `PUT` | `/api/sensors/{id}` | Atualizar sensor |

### WebSocket Endpoint

**URL:** `ws://localhost:8080/ws/sensors`

**Mensagem de Conexão (Client → Server):**

```json
{
  "type": "SUBSCRIBE",
  "sensorId": "sensor-001"
}
```

**Mensagem de Dados (Server → Client):**

```json
{
  "sensorId": "sensor-001",
  "sensorName": "Temperatura Sala",
  "value": 22.5,
  "unit": "°C",
  "type": "TEMPERATURE",
  "timestamp": 1711363200000,
  "status": "online"
}
```

---

## Arquitetura Frontend

### Sistema de Temas

Implementado com CSS custom properties (variáveis CSS):

**Modo Claro:**
- Background: `#fef7ed` (bege quente)
- Accent: `#ea580c` (laranja)
- Text: `#1a1a1a` (preto)

**Modo Escuro:**
- Background: `#0f0b08` (castanho escuro)
- Accent: `#f97316` (laranja quente)
- Text: `#f5f5f5` (branco)

**Ativar tema:**

```typescript
// Em qualquer componente
const [theme, setTheme] = useState('light');
document.documentElement.setAttribute('data-theme', theme);
localStorage.setItem('theme', theme);
```

### Componentes Principais

**Dashboard** - Orquestrador central:
- Botão de toggle (Sun/Moon icons)
- Lista de sensores
- Gráficos em tempo real
- Status global

**SensorCard** - Card individual:
- Ícone do tipo de sensor
- Valor atual com trending
- Min/Max/Média
- Status de conexão
- Último atualizado

**SensorChart** - Gráfico de linha:
- Histórico de dados
- Cores por tipo (Temp: `#fb923c`, Umidade: `#f97316`, etc.)
- Tooltip interativo
- Zoom/Pan com Recharts

---

## Arquitetura Backend

### Spring Boot Stack

- **Spring Web**: REST API + Controller mapping
- **Spring WebSocket**: Handler bidirecional com STOMP
- **Spring Integration MQTT**: Listener para broker MQTT
- **H2 Database**: In-memory para desenvolvimento (swappable para MySQL/PostgreSQL)
- **Spring Actuator**: Health checks e métricas

### Fluxo de Dados

```
[MQTT Broker] 
      ↓
  [MqttIngressService]
      ↓
[SensorIngestionService] → [Database]
      ↓
[WebSocketHandler]
      ↓
[Frontend WebSocket]
```

### Configuração Spring

**application.properties** (parametrizado via `${ENV_VAR:default}`):

```properties
spring.datasource.url=jdbc:h2:mem:iotdb
spring.datasource.username=${DB_USERNAME:sa}
spring.datasource.password=${DB_PASSWORD:}
spring.h2.console.enabled=true

# MQTT
iot.mqtt.enabled=true
iot.mqtt.url=${IOT_MQTT_URL:tcp://broker.hivemq.com:1883}
iot.mqtt.username=${IOT_MQTT_USERNAME:}
iot.mqtt.password=${IOT_MQTT_PASSWORD:}
iot.mqtt.topic=sensors/+/data

# Health
management.endpoints.web.exposure.include=health,info
management.endpoint.health.show-details=always
```

---

## Segurança

### Boas Práticas Implementadas

1. **Variáveis de Ambiente**
   - Frontend: Prefixo `NEXT_PUBLIC_` apenas para valores públicos
   - Backend: `${VAR:default}` syntax em properties
   - Nunca commitar `.env.local` (no `.gitignore`)

2. **.gitignore Robusto**
   - **Frontend**: `node_modules/`, `.next/`, `build/`, `.env.local`
   - **Backend**: `target/`, `.idea/`, `.vscode/`, `*.pem`, `*.key`, `*.p12`, `*.jks`

3. **Credenciais Seguras**
   - `.env.example` com valores placeholder (safe to commit)
   - Todas as senhas gerenciadas via env vars
   - Nenhuma chave privada em tracking

4. **CORS Habilitado**
   - Frontend em `localhost:3000` → Backend em `localhost:8080`
   - Configurável via `CorsConfig.java`

---

##  Tipos de Sensores Suportados

```java
public enum SensorType {
  TEMPERATURE,  // °C
  HUMIDITY,     // %
  PRESSURE,     // hPa
  LIGHT,        // lux
  MOTION        // boolean
}
```

---

## Dependências Principais

### Frontend

```json
{
  "next": "16.2.1",
  "react": "19",
  "typescript": "5",
  "tailwindcss": "4",
  "recharts": "^2.x",
  "lucide-react": "^0.x",
  "ws": "^8.x"
}
```

### Backend

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
  <version>2.7.18</version>
</dependency>
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-websocket</artifactId>
  <version>2.7.18</version>
</dependency>
<dependency>
  <groupId>org.springframework.integration</groupId>
  <artifactId>spring-integration-mqtt</artifactId>
  <version>5.7.x</version>
</dependency>
<dependency>
  <groupId>com.h2database</groupId>
  <artifactId>h2</artifactId>
  <version>2.1.x</version>
</dependency>
```

---

## Desenvolvimento

### Modo Watch (Frontend)

```bash
npm run dev
```

Recompila automaticamente ao salvar arquivos.

### Build para Produção (Frontend)

```bash
npm run build
npm run start
```

### Lint & Type Check

```bash
npm run lint
npx tsc --noEmit
```

### Build et Backend

```bash
cd iot-backend-java
mvn clean package -DskipTests
```

Gera JAR em `target/backend-X.X.X.jar`

---

## Deployment

### Opção 1: Docker

```dockerfile
# Frontend Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
EXPOSE 3000
CMD ["npm", "run", "start"]
```

### Opção 2: Heroku/Railway

**Frontend:**

```bash
npm run build
git push heroku main
```

**Backend:**

```bash
cd iot-backend-java
git subtree push --prefix iot-backend-java heroku main
```

### Opção 3: AWS/Azure/GCP

- Frontend: Deploy para S3 + CloudFront ou App Service
- Backend: Deploy JAR para EC2, App Service, ou Cloud Run

---

## Testes

### Frontend (Jest + React Testing Library)

```bash
npm run test
npm run test:coverage
```

### Backend (JUnit + Mockito)

```bash
cd iot-backend-java
mvn test
```

---

## Contribuindo

1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Commit suas mudanças: `git commit -m 'Add nova feature'`
4. Push: `git push origin feature/minha-feature`
5. Abra um Pull Request

## Suporte

Para dúvidas ou bugs:
- Entre em contato: perres9

---

**Desenvolvido como projeto fullstack moderno demonstrando:**

-  Tipagem segura TypeScript + Java
-  Comunicação em tempo real com WebSocket
-  Design responsivo e temático
-  Segurança em produção
-  Arquitetura escalável
-  Visualização avançada de dados
