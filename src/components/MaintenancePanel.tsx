import React from 'react';
import useFetch from '../hooks/useFetch';

interface MaintenanceRecord {
    id: number;
    type: 'ROUTINE' | 'REPAIR' | 'INSPECTION';
    scheduledAt: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    notes?: string;
    equipment: {equipmentId: string; name: string; location:string;}
}

const MaintenancePanel: React.FC = () => {
    const {data: records, loading} = useFetch<MaintenanceRecord[]>('/api/maintenance/upcoming?days=7', 3000);

    if (loading) return <div className="text-gray-400 text-sm">Loading maintenance schedule...</div>;

    return (
        <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-base font-semibold text-gray-700 mb-3">
                Upcoming Maintenance (Next 7 Days)
            </h2>
            {!records?.length ? (
                <p className="text-gray-400 text-sm">No maintenance scheduled.</p>
            ):(
                <ul className="space-y-2">
                    {records.map(record => {
                        return <li key = {record.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">
                                    {record.equipment.name} ({record.equipment.equipmentId})
                                </p>
                                <p className="text-xs text-gray-500">
                                    {record.type} · {new Date(record.scheduledAt).toLocaleDateString()}
                                </p>
                                {record.notes && <p className="text-xs text-gray-400 mt-0.5 truncate">{record.notes}</p>}
                            </div>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                                {record.status}
                            </span>
                        </li>
                    })}
                </ul>
            )}

        </div>
    )
}

export default MaintenancePanel;