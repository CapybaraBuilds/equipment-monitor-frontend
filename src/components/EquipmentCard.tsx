import React, {memo} from 'react';
import type {EquipmentStatus} from '../types';

interface Props {
    equipmentId: string;
    name: string;
    location: string;
    status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'ERROR';
    isSelected: boolean;
    onClick: (id: string) => void; // a function with no parameters and return value
}

const statusConfig: Record<EquipmentStatus, {color: string; dot: string; label: string;}> = {
    ONLINE: {color: 'bg-green-50 border-green-200', dot: 'bg-green-500', label: 'Online'},
    OFFLINE: {color: 'bg-gray-50 border-gray-200', dot: 'bg-gray-500', label: 'Offline'},
    MAINTENANCE: {color: 'bg-blue-50 border-blue-200', dot: 'bg-blue-500', label: 'Maintenance'},
    ERROR: {color: 'bg-red-50 border-red-200', dot: 'bg-red-500', label: 'Error'}
}

const EquipmentCard: React.FC<Props> = ({equipmentId, name, location, status, isSelected, onClick}) => {
    const config = statusConfig[status] ?? statusConfig.OFFLINE;
    console.log(`${equipmentId}`)
    return (
        <div onClick = {()=>onClick(equipmentId)} className = {`p-4 rounded-1g border-2 cursor-pointer transition-all ${config.color} ${isSelected ? 'ring-2 ring-blue-400 shadow-md' : 'hover:shadow-sm'}`}>
            <div className = "flex justify-between items-start mb-2">
                <span className = 'font-bold text-gray-800'>{equipmentId}</span>
                <span className = "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full">
                    <span className = {`w-2 h-2 rounded-full ${config.dot}`}></span>
                    {config.label}
                </span>
            </div>
            <p className = "text-sm text-gray-600 truncate">{name}</p>
            <p className = "text-sm text-gray-400 mt-1">{location}</p>
        </div>
    );
};

export default memo(EquipmentCard);