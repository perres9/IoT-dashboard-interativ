# IoT Dashboard - Monitoramento de Sensores em Tempo Real

desenvolvido por: perres9

Um dashboard moderno desenvolvido com **Next.js + TypeScript + React** para visualizar dados de sensores IoT em tempo real com gráficos interativos.

## Destaques

- **TypeScript Puro**: Tipagem segura em todo o projeto
- **Tempo Real**: Suporte para WebSocket e atualização automática de dados
- **Componentes Reutilizáveis**: Arquitetura de componentes bem estruturada
- **Gráficos Interativos**: Visualização de dados com Recharts
- **Responsive**: Interface mobile-friendly com Tailwind CSS
- **Mock Data**: Simulador de sensores para desenvolvimento

## Tecnologias

- **Framework**: Next.js 16.2.1 com App Router
- **Linguagem**: TypeScript 5
- **Estilização**: Tailwind CSS 4
- **Gráficos**: Recharts
- **Ícones**: Lucide React
- **Estado**: React Context API
- **WebSocket**: Suporte nativo para `ws`

## Estrutura do Projeto

```text
src/
├── app/                    # App Router do Next.js
│   ├── layout.tsx         # Layout raiz com SensorProvider
│   ├── page.tsx           # Página principal
│   └── globals.css        # Estilos globais
├── components/            # Componentes React
│   ├── Dashboard.tsx      # Componente principal do dashboard
│   ├── SensorCard.tsx     # Card individual de sensor
│   ├── SensorChart.tsx    # Gráfico de dados do sensor
│   └── StatusBadge.tsx    # Badge de status online/offline
├── context/              # Context API
│   └── SensorContext.tsx  # Gerenciador de estado global dos sensores
├── hooks/                # Custom React Hooks
│   └── useWebSocket.ts   # Hook para gerenciar conexão WebSocket
├── types/                # Definições TypeScript
│   └── sensor.ts         # Tipos e interfaces dos sensores
└── utils/                # Utilitários
    └── mockData.ts       # Dados de teste e gerador de dados
```

## Componentes Principais

### Dashboard

Componente principal que:

- Exibe status geral dos sensores
- Mostra cards com dados individuais
- Renderiza gráficos com histórico de dados
- Simula atualizações em tempo real

### SensorCard

Exibe informações de um sensor:

- Valor atual com tendência
- Média, mínimo e máximo
- Status de conexão
- Último tempo de atualização

### SensorChart

Visualiza o histórico de dados:

- Gráfico de linha interativo
- Cores específicas por tipo de sensor
- Tooltip com informações detalhadas
- Escala automática

### StatusBadge

Indica status de conectividade:

- Online (verde)
- Offline (vermelho)

## Tipos de Sensores

O projeto suporta múltiplos tipos de sensores:

```typescript
enum SensorType {
  TEMPERATURE = "temperature", // Temperatura (°C)
  HUMIDITY = "humidity", // Umidade (%)
  PRESSURE = "pressure", // Pressão (hPa)
  LIGHT = "light", // Luz (lux)
  MOTION = "motion", // Movimento
}
```

## Estrutura de Dados

### Sensor

```typescript
interface Sensor {
  id: string; // ID único
  name: string; // Nome do sensor
  type: SensorType; // Tipo de sensor
  location: string; // Localização física
  currentValue: number; // Valor atual
  unit: string; // Unidade de medida
  readings: SensorReading[]; // Histórico de leituras
  status: "online" | "offline"; // Status de conexão
  lastUpdate: number; // Timestamp da última atualização
  minValue?: number; // Valor mínimo esperado
  maxValue?: number; // Valor máximo esperado
}
```

## Como Usar

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000` para ver o dashboard.

### Build para Produção

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

## Integração com WebSocket

Para conectar com um servidor WebSocket real, edite o hook `useWebSocket`:

```typescript
const { isConnected } = useWebSocket({
  url: "ws://seu-servidor.com:8080",
  onMessage: (data) => {
    updateSensorReading(data);
  },
  enabled: true,
});
```

O servidor deve enviar mensagens no formato:

```json
{
  "sensorId": "sensor-001",
  "value": 22.5,
  "timestamp": 1711363200000
}
```

## Context API - Gerenciamento de Estado

### useSensorContext

```typescript
const {
  state, // SensorState (sensores, loading, error)
  setSensors, // Adicionar sensores
  updateSensorReading, // Atualizar leitura
  setSensorStatus, // Mudar status de conectividade
  getSensorById, // Obter sensor por ID
  getAllSensors, // Obter todos os sensores
} = useSensorContext();
```

## Recursos Principais

- Dashboard em tempo real
- Múltiplos sensores
- Gráficos interativos
- Status de conexão
- Histórico de dados
- Interface responsiva
- Mock data para desenvolvimento
- TypeScript completo

## TypeScript e Segurança

- Todas as interfaces e tipos são definidas explicitamente
- VSCode IntelliSense completo
- Detecção de erros em tempo de compilação
- ESLint configurado para best practices

## Dados Mock

O projeto inclui dados simulados para desenvolvimento. Para gerar novos dados:

```typescript
import { getRandomSensorUpdate } from "@/utils/mockData";

const update = getRandomSensorUpdate();
// { sensorId: "sensor-001", value: 22.3, timestamp: ... }
```

## Customização

### Adicionar novo tipo de sensor

1. Atualize `SensorType` em `src/types/sensor.ts`
2. Adicione novo sensor em `src/utils/mockData.ts`
3. Atualize cores no `SensorChart.tsx`

### Modificar layout

Edite as classes Tailwind nos componentes em `src/components/`

### Alterar frequência de atualizações

Modifique o intervalo em `Dashboard.tsx`:

```typescript
setInterval(() => {
  const update = getRandomSensorUpdate();
  updateSensorReading(update);
}, 3000); // 3 segundos
```

## Licença

MIT

## Desenvolvido com

- Next.js App Router
- React 19
- TypeScript 5
- Tailwind CSS 4
- Recharts
- Lucide React

desenvolvido por: perres9

---

**Desenvolvido como projeto educacional para demonstrar:**

- Tipagem segura com TypeScript
- Padrões React modernos (Hooks, Context)
- Integração de hardware com web
- Visualização de dados em tempo real
