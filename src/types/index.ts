export type EquipmentStatus = 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'ERROR';

export interface Equipment {
    id: number;
    equipmentId: string;
    name: string;
    model: string;
    location: string;
    status: EquipmentStatus;
    installedAt: string;
    assignedTo?: string;
}

export interface SensorReading {
    type: string;
    value: number;
    unit: string;
}

export interface SensorData {
    equipmentId: string;
    timestamp: string;
    readings: SensorReading[];
}