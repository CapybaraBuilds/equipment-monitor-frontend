import React, {useState, useEffect} from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import { getSensorHistory } from '../api/client';

interface Props {
    equipmentId: string;
}

interface ChartDataPoint {
    time: string;
    temperature?: number;
    pressure?: number;
    rpm?: number;
}

const SensorChart: React.FC<Props> = ({equipmentId}) => {
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

    useEffect(() => {
        setChartData([])

        const fetchAndUpdate = async () => {
            try{
                const from = new Date(Date.now() - 60 * 1000).toISOString();
                const res = await getSensorHistory(equipmentId, from);
                const points: ChartDataPoint[] = res.data.data.reverse().map(d => {
                    const point: ChartDataPoint = {
                        time: new Date(d.timestamp).toISOString()
                    };
                    d.readings.forEach(r => {
                        if (r.type === 'temperature') point.temperature = parseFloat(r.value.toFixed(1));
                        if (r.type === 'pressure') point.pressure = parseFloat(r.value.toFixed(2));
                        if (r.type === 'rpm') point.rpm = parseFloat(r.value.toFixed(0));
                    });
                    return point;
                })
                setChartData(points);
            }catch(err){
                console.error('Failed to fetch sensor history: ', err);
            }
        };
        fetchAndUpdate();
        const interval = setInterval(fetchAndUpdate, 2000);
        return () => clearInterval(interval);
    }, [equipmentId]);

    return (
        <div className = "bg-white rounded-1g p-4 shadow-sm">
            <h2 className = "text-1g font-semibold text-gray-700 mb-4">
                {equipmentId} - Real-time Sensor Data (last 60s)
            </h2>
            <ResponsiveContainer width = "100%" height = {300}>
                <LineChart data = {chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="time" tick={{fontSize: 11}} interval = "preserveStartEnd" />
                    <YAxis tick={{fontSize: 11}} />
                    <Tooltip />
                    <Legend />
                    <Line type = "monotone" dataKey="temperature" stroke="#ef4444" dot={false} name="Temp (°C)" strokeWidth={2} />
                    <Line type = "monotone" dataKey="pressure" stroke="#3b82f6" dot={false} name="Pressure (bar)" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SensorChart;

