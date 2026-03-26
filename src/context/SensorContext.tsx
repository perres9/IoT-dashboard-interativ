"use client";

/**
 * Sensor Context
 * Manages global state for sensor data across the application
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from "react";
import { Sensor, SensorDataPayload } from "@/types/sensor";

interface SensorState {
  sensors: Map<string, Sensor>;
  loading: boolean;
  error: string | null;
}

type SensorAction =
  | { type: "SET_SENSORS"; payload: Sensor[] }
  | { type: "UPDATE_SENSOR_READING"; payload: SensorDataPayload }
  | {
      type: "SET_SENSOR_STATUS";
      payload: { sensorId: string; status: "online" | "offline" };
    }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

const initialState: SensorState = {
  sensors: new Map(),
  loading: false,
  error: null,
};

const sensorReducer = (
  state: SensorState,
  action: SensorAction,
): SensorState => {
  switch (action.type) {
    case "SET_SENSORS": {
      const newMap = new Map<string, Sensor>();
      action.payload.forEach((sensor) => {
        newMap.set(sensor.id, sensor);
      });
      return { ...state, sensors: newMap, loading: false };
    }

    case "UPDATE_SENSOR_READING": {
      const sensor = state.sensors.get(action.payload.sensorId);
      if (!sensor) return state;

      const updatedSensor = {
        ...sensor,
        currentValue: action.payload.value,
        lastUpdate: action.payload.timestamp,
        readings: [
          ...sensor.readings.slice(-19),
          {
            value: action.payload.value,
            timestamp: action.payload.timestamp,
            unit: sensor.unit,
          },
        ],
      };

      const newSensors = new Map(state.sensors);
      newSensors.set(sensor.id, updatedSensor);
      return { ...state, sensors: newSensors };
    }

    case "SET_SENSOR_STATUS": {
      const sensor = state.sensors.get(action.payload.sensorId);
      if (!sensor) return state;

      const updatedSensor = {
        ...sensor,
        status: action.payload.status,
      };

      const newSensors = new Map(state.sensors);
      newSensors.set(sensor.id, updatedSensor);
      return { ...state, sensors: newSensors };
    }

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    default:
      return state;
  }
};

interface SensorContextType {
  state: SensorState;
  setSensors: (sensors: Sensor[]) => void;
  updateSensorReading: (data: SensorDataPayload) => void;
  setSensorStatus: (sensorId: string, status: "online" | "offline") => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getSensorById: (id: string) => Sensor | undefined;
  getAllSensors: () => Sensor[];
}

const SensorContext = createContext<SensorContextType | undefined>(undefined);

export const SensorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(sensorReducer, initialState);

  const setSensors = useCallback((sensors: Sensor[]) => {
    dispatch({ type: "SET_SENSORS", payload: sensors });
  }, []);

  const updateSensorReading = useCallback((data: SensorDataPayload) => {
    dispatch({ type: "UPDATE_SENSOR_READING", payload: data });
  }, []);

  const setSensorStatus = useCallback(
    (sensorId: string, status: "online" | "offline") => {
      dispatch({ type: "SET_SENSOR_STATUS", payload: { sensorId, status } });
    },
    [],
  );

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: "SET_ERROR", payload: error });
  }, []);

  const getSensorById = useCallback(
    (id: string) => state.sensors.get(id),
    [state.sensors],
  );

  const getAllSensors = useCallback(
    () => Array.from(state.sensors.values()),
    [state.sensors],
  );

  const value: SensorContextType = {
    state,
    setSensors,
    updateSensorReading,
    setSensorStatus,
    setLoading,
    setError,
    getSensorById,
    getAllSensors,
  };

  return (
    <SensorContext.Provider value={value}>{children}</SensorContext.Provider>
  );
};

export const useSensorContext = () => {
  const context = useContext(SensorContext);
  if (!context) {
    throw new Error("useSensorContext must be used within a SensorProvider");
  }
  return context;
};
