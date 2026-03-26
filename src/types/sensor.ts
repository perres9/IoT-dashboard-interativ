/**
 * Sensor Type Definitions
 * Ensures type safety for all sensor data across the application
 */

export enum SensorType {
  TEMPERATURE = "temperature",
  HUMIDITY = "humidity",
  PRESSURE = "pressure",
  LIGHT = "light",
  MOTION = "motion",
}

export interface SensorReading {
  value: number;
  timestamp: number;
  unit: string;
}

export interface Sensor {
  id: string;
  name: string;
  type: SensorType;
  location: string;
  currentValue: number;
  unit: string;
  readings: SensorReading[];
  status: "online" | "offline";
  lastUpdate: number;
  minValue?: number;
  maxValue?: number;
}

export interface SensorDataPayload {
  sensorId: string;
  value: number;
  timestamp: number;
}

export interface WebSocketMessage {
  type: "data" | "status" | "error";
  payload:
    | SensorDataPayload
    | { sensorId: string; status: string }
    | { message: string };
}
