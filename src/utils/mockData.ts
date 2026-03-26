/**
 * Mock sensor data generator
 * Simulates real sensor data for development
 */

import { Sensor, SensorType, SensorReading } from "@/types/sensor";

const generateReadings = (
  count: number,
  min: number,
  max: number,
): SensorReading[] => {
  const readings: SensorReading[] = [];
  const now = Date.now();

  for (let i = count; i > 0; i--) {
    readings.push({
      value: Math.random() * (max - min) + min,
      timestamp: now - i * 60000, // 1 minute apart
      unit: min === 0 && max === 100 ? "%" : "°C",
    });
  }

  return readings;
};

export const MOCK_SENSORS: Sensor[] = [
  {
    id: "sensor-001",
    name: "Temperature - Sala",
    type: SensorType.TEMPERATURE,
    location: "Living Room",
    currentValue: 22.5,
    unit: "°C",
    readings: generateReadings(20, 20, 25),
    status: "online",
    lastUpdate: Date.now(),
    minValue: 15,
    maxValue: 35,
  },
  {
    id: "sensor-002",
    name: "Humidity - Sala",
    type: SensorType.HUMIDITY,
    location: "Living Room",
    currentValue: 65,
    unit: "%",
    readings: generateReadings(20, 40, 80),
    status: "online",
    lastUpdate: Date.now(),
    minValue: 0,
    maxValue: 100,
  },
  {
    id: "sensor-003",
    name: "Temperature - Quarto",
    type: SensorType.TEMPERATURE,
    location: "Bedroom",
    currentValue: 19.8,
    unit: "°C",
    readings: generateReadings(20, 18, 22),
    status: "online",
    lastUpdate: Date.now(),
    minValue: 15,
    maxValue: 35,
  },
  {
    id: "sensor-004",
    name: "Light Level - Cozinha",
    type: SensorType.LIGHT,
    location: "Kitchen",
    currentValue: 750,
    unit: "lux",
    readings: generateReadings(20, 500, 1000),
    status: "online",
    lastUpdate: Date.now(),
    minValue: 0,
    maxValue: 1000,
  },
  {
    id: "sensor-005",
    name: "Pressure - Externo",
    type: SensorType.PRESSURE,
    location: "Outdoor",
    currentValue: 1013.25,
    unit: "hPa",
    readings: generateReadings(20, 1010, 1016),
    status: "online",
    lastUpdate: Date.now(),
    minValue: 950,
    maxValue: 1050,
  },
];

export const getRandomSensorUpdate = () => {
  const sensor = MOCK_SENSORS[Math.floor(Math.random() * MOCK_SENSORS.length)];
  const variationRange = sensor.currentValue * 0.1;
  const newValue = sensor.currentValue + (Math.random() - 0.5) * variationRange;

  return {
    sensorId: sensor.id,
    value: Math.max(
      sensor.minValue || 0,
      Math.min(sensor.maxValue || Infinity, newValue),
    ),
    timestamp: Date.now(),
  };
};
