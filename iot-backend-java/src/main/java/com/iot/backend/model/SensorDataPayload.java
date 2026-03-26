package com.iot.backend.model;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class SensorDataPayload {

    @NotBlank // Sensor ID is the key used to group latest state and history.
    private String sensorId;

    @NotNull // Value is required because charts depend on numeric points.
    private Double value;

    @NotNull // Timestamp is required to preserve ordering and timeline integrity.
    private Long timestamp;

    private String unit; // Optional because some sensors may have implicit units.

    private SensorType type = SensorType.UNKNOWN; // Defaults to UNKNOWN when source omits type.

    private String location; // Helps dashboard segment devices by environment.

    private String status = "online"; // Allows source systems to mark offline or degraded states.

    public String getSensorId() {
        return sensorId;
    }

    public void setSensorId(String sensorId) {
        this.sensorId = sensorId;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public SensorType getType() {
        return type;
    }

    public void setType(SensorType type) {
        this.type = type;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
