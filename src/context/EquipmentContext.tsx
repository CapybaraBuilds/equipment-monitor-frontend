import React, {createContext, useContext, useState, useEffect} from 'react';
import useFetch from '../hooks/useFetch';
import type {Equipment} from '../types';

// Context data type
interface EquipmentContextValue {
    equipmentList: Equipment[] | null;
    selectedId: string | null;
    setSelectedId: (id: string) => void;
    loading: boolean;
    error: string | null;
}

// Create context

const EquipmentContext = createContext<EquipmentContextValue | null>(null);

// Provider component: wraps components that need access to equipment data
export function EquipmentProvider({children}: {children:React.ReactNode}){
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const {data: equipmentList, loading, error} = useFetch<Equipment[]>('/api/equipment', 5000);

    useEffect(()=>{
        if(equipmentList?.length && !selectedId){
            setSelectedId(equipmentList[0].equipmentId);
        }
    },[equipmentList, selectedId]);

    return (
    <EquipmentContext.Provider value = {{equipmentList, selectedId, setSelectedId, loading, error}}>
        {children}
    </EquipmentContext.Provider>
    );
}

// custom hook to use the equipment context and check null
export function useEquipment(): EquipmentContextValue {
    const ctx = useContext(EquipmentContext);
    if(!ctx) throw new Error('useEquipment must be used within an EquipmentProvider');
    return ctx;
}