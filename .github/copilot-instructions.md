# IoT Dashboard - Instruções para o Copilot

## Visão Geral do Projeto

Este é um dashboard de monitoramento de sensores IoT desenvolvido com **Next.js + TypeScript + React**. O projeto demonstra:

- Tipagem segura com TypeScript
- Padrões React modernos (Hooks, Context API)
- Integração de dados em tempo real (WebSocket)
- Visualização de dados com Recharts
- Componentes reutilizáveis e bem estruturados

## Estrutura Principal

```
src/
├── app/              # Next.js App Router (Layout, Página Principal)
├── components/       # Componentes React (Dashboard, Cards, Charts)
├── context/          # Context API para gerenciamento de estado
├── hooks/            # Custom hooks (useWebSocket)
├── types/            # Tipos TypeScript
└── utils/            # Utilitários (mock data, helpers)
```

## Padrões de Código

### Denominação
- **Componentes**: PascalCase (`Dashboard.tsx`, `SensorCard.tsx`)
- **Arquivos**: snake-case ou PascalCase conforme tipo
- **Variáveis/Funções**: camelCase
- **Constantes**: UPPER_SNAKE_CASE

### Estrutura de Componentes

Todos os componentes seguem este padrão:

```typescript
'use client';  // Client components usam directive

import { useCallback } from 'react';
import type { Sensor } from '@/types/sensor';

export const MyComponent: React.FC<Props> = ({ prop }) => {
  // Hook calls
  const value = useSensorContext();

  // Handlers
  const handleClick = useCallback(() => {}, []);

  // Render
  return <div>{/* JSX */}</div>;
};
```

### Tipos TypeScript

Sempre defina tipos explicitamente:

```typescript
interface SensorProps {
  sensor: Sensor;
  onUpdate?: (id: string) => void;
}

export const SensorCard: React.FC<SensorProps> = ({ sensor, onUpdate }) => {
  // ...
};
```

## Fluxo de Dados

1. **Inicialização**: `Dashboard` carrega `MOCK_SENSORS` via `setSensors()`
2. **Contexto**: `SensorProvider` gerencia estado global com `useReducer`
3. **Atualização**: Timer simula WebSocket, chama `updateSensorReading()`
4. **Renderização**: Componentes ler do contexto e re-renderizam

## Adições Comuns

### Adicionar Novo Tipo de Sensor

1. **types/sensor.ts**: Atualize `SensorType` enum
2. **utils/mockData.ts**: Adicione nova sensor em `MOCK_SENSORS`
3. **components/SensorChart.tsx**: Atualize cores em `getLineColor()`

### Conectar WebSocket Real

Em `components/Dashboard.tsx`, desative mock data:

```typescript
// Remove this useEffect
// useEffect(() => { setInterval(...) }, [...]);

// Use real WebSocket
const { isConnected } = useWebSocket({
  url: 'ws://seu-servidor.com:8080',
  onMessage: (data) => updateSensorReading(data),
  enabled: true,
});
```

### Adicionar Novo Componente

```typescript
// src/components/MyComponent.tsx
'use client';

import type { Sensor } from '@/types/sensor';

interface MyComponentProps {
  sensor: Sensor;
}

export const MyComponent: React.FC<MyComponentProps> = ({ sensor }) => {
  return <div>{/* conteúdo */}</div>;
};
```

## Guia de Desenvolvimento

### Iniciar Servidor Dev
```bash
npm run dev
```
Acesse http://localhost:3000

### Build Produção
```bash
npm run build
npm run start
```

### Linting
```bash
npm run lint
```

## TypeScript - Regras Importantes

- SEMPRE use tipos explícitos para props  
- SEMPRE tipifique retornos de funções  
- Use `type` para tipos simples, `interface` para objetos  
- Use `React.FC<Props>` para componentes  
- Evite `any` - use `unknown` se necessário e faça type narrowing  

## Context API - Como Usar

```typescript
import { useSensorContext } from '@/context/SensorContext';

export const MyComponent = () => {
  const { state, setSensors, updateSensorReading } = useSensorContext();
  
  // state.sensors é um Map<string, Sensor>
  const sensors = Array.from(state.sensors.values());
  
  return (/* ... */);
};
```

## Mock Data

Dados de teste estão em `utils/mockData.ts`:

```typescript
import { MOCK_SENSORS, getRandomSensorUpdate } from '@/utils/mockData';

const { sensorId, value, timestamp } = getRandomSensorUpdate();
```

## Componentes Key

| Componente | Responsabilidade |
|-----------|-----------------|
| `Dashboard` | Orquestra todo o dashboard |
| `SensorCard` | Exibe info de um sensor |
| `SensorChart` | Gráfico de histórico |
| `StatusBadge` | Status online/offline |

## Hooks Custom

### useWebSocket
```typescript
const { isConnected, send } = useWebSocket({
  url: 'ws://localhost:8080',
  onMessage: (data) => { /* ... */ },
  enabled: true,
});
```

## Próximos Passos Sugeridos

1. **Conectar com ESP32**: Configure WebSocket real
2. **Adicionar Banco de Dados**: Persistir histórico
3. **Autenticação**: Adicionar login
4. **Alertas**: Notificações quando valor sai do range
5. **Export**: Exportar dados em CSV/JSON
6. **Temas**: Modo escuro
7. **Mobile**: PWA ou app nativo

## Dependências Principais

- `next`: Framework React com SSR
- `recharts`: Gráficos
- `lucide-react`: Ícones
- `tailwindcss`: Estilização
- `typescript`: Tipagem estática

## Troubleshooting

**"undefined is not a function"**
- Verifique se o componente é `'use client'`
- Verifique se hooks estão sendo chamados corretamente

**Tipos não funcionando**
- Execute `npm run build` para ver erros do TypeScript
- Verifique imports de tipos com `import type`

**WebSocket não conecta**
- Verifique se o servidor está rodando
- Verifique URL em `useWebSocket`
- Abra DevTools > Network > WS para debugar

## Performance

- Componentes com `'use client'` apenas quando necessário
- Use `useCallback` para funções em handlers
- Use `useMemo` para cálculos caros (se necessário)
- Recharts já é otimizado para re-renders

## Estilo & Tailwind

- Use classes Tailwind ao invés de CSS customizado
- Respeitamos breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Cores: `blue`, `green`, `red`, `gray` da paleta padrão

---

**Desenvolvido para demonstrar boas práticas em React + TypeScript**
