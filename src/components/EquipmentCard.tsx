import React from 'react';
import type {Equipment, EquipmentStatus} from '../types';

interface Props {
    equipment: Equipment;
    isSelected: boolean;
    onClick: () => void; // a function with no parameters and return value
}

const statusConfig: Record<EquipmentStatus, {color: string; dot: string; label: string;}> = {
    ONLINE: {color: 'bg-green-50 border-green-200', dot: 'bg-green-500', label: 'Online'},
    OFFLINE: {color: 'bg-gray-50 border-gray-200', dot: 'bg-gray-500', label: 'Offline'},
    MAINTENANCE: {color: 'bg-blue-50 border-blue-200', dot: 'bg-blue-500', label: 'Maintenance'},
    ERROR: {color: 'bg-red-50 border-red-200', dot: 'bg-red-500', label: 'Error'}
}

const EquipmentCard: React.FC<Props> = ({equipment, isSelected, onClick}) => {
    const config = statusConfig[equipment.status] ?? statusConfig.OFFLINE;
    return (
        <div onClick = {onClick} className = {`p-4 rounded-1g border-2 cursor-pointer transition-all ${config.color} ${isSelected ? 'ring-2 ring-blue-400 shadow-md' : 'hover:shadow-sm'}`}>
            <div className = "flex justify-between items-start mb-2">
                <span className = 'font-bold text-gray-800'>{equipment.equipmentId}</span>
                <span className = "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full">
                    <span className = {`w-2 h-2 rounded-full ${config.dot}`}></span>
                    {config.label}
                </span>
            </div>
            <p className = "text-sm text-gray-600 truncate">{equipment.name}</p>
            <p className = "text-sm text-gray-400 mt-1">{equipment.location}</p>
        </div>
    );
};

export default EquipmentCard;