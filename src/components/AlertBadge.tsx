import React from 'react';
import useFetch from '../hooks/useFetch';

interface Alert{
    equipmentId: string;
    type: string; // temperature or pressure
    severity: 'WARNING' | 'CRITICAL';
    value: number;
    threshold: number;
    timestamp: string;
    message: string;
}

const severityStyle : Record<Alert['severity'], {bg: string; text: string; border: string;}> = {
    WARNING: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-300' },
    CRITICAL: { bg: 'bg-red-50',    text: 'text-red-800',    border: 'border-red-300' },
};

const AlertBadge: React.FC = () => {
    const {data:alerts, loading} = useFetch<Alert[]>('/api/sensor/alerts', 3000);
    if (loading) return <div className="text-gray-400 text-sm">Loading alerts...</div>;
    if (!alerts?.length) return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm">
            No active alerts
        </div>
    )
    return (
        <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Recent Alerts
            </h2>
            {alerts.slice(0,10).map((alert) => {
                const style = severityStyle[alert.severity];
                return (
                    <div key = {alert.equipmentId + alert.type + alert.timestamp} className = {`p-3 rounded-lg border ${style.bg} ${style.border}`}>
                        <div className="flex justify-between items-center">
                            <span className={`text-xs font-bold uppercase ${style.text}`}>{alert.severity}</span>
                            <span className="text-xs text-gray-400">{new Date(alert.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className={`text-sm mt-1 ${style.text}`}>{alert.message}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default AlertBadge;