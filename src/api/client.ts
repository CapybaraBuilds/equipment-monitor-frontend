import axios from 'axios';
import type {Equipment, SensorData} from '../types/index';

const api = axios.create({
    baseURL: '/api',
    timeout: 5000,
});

export const getEquipmentList = () => api.get<Equipment[]>('/equipment');
export const getLatestSensorData = (equipmentId: string) => api.get<SensorData>(`/sensor/${equipmentId}/latest`);
export const getSensorHistory = (equipmentId: string, from?: string) => api.get<{count: number, data: SensorData[]}>(`/sensor/${equipmentId}/history`, {params: {from}});