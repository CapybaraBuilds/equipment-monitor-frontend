import React, { useState, useEffect } from 'react'
import EquipmentCard from './components/EquipmentCard';
import SensorChart from './components/SensorChart';
import useFetch from './hooks/useFetch';
import type {Equipment} from './types';
import { useEquipment } from './context/EquipmentContext';
import AlertBadge from './components/AlertBadge';
import MaintenancePanel from './components/MaintenancePanel';
// import { getEquipmentList, getLatestSensorData, getSensorHistory } from './api/client';

const App: React.FC = () => {
  // const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  // const [selectedId, setSelectedId] = useState<string | null>(null);

  // const {data: equipmentList, loading, error} = useFetch<Equipment[]>('/api/equipment', 5000);
  const {equipmentList, selectedId, setSelectedId, loading, error} = useEquipment();
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchEquipment = async () => {
  //     try{
  //       const res = await getEquipmentList();
  //       setEquipmentList(res.data);
  //       if(res.data.length > 0 && selectedId ===  null) setSelectedId(res.data[0].equipmentId);
  //     } catch(err){
  //       console.error('Failed to fetch equipment: ', err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchEquipment();
  //   const interval = setInterval(fetchEquipment, 5000);
  //   return () => clearInterval(interval)
  // }, [selectedId])

  useEffect(() => {
    if(equipmentList && equipmentList.length > 0 && !selectedId){
      setSelectedId(equipmentList[0].equipmentId);
    }
  }, [equipmentList, selectedId]);

  return (
    <div className = "min-h-screen bg-gray-100">
      <header className = "bg-gray-900 text-white px-6 py-4">
        <h1 className = "text-xl font-bold">Industrial Equipment Monitor</h1>
      </header>
      <main className = "p-6">
        {loading ? (<p className = "text-gray-500">Loading equipment...</p>) : (
          <div className = "grid grid-cols-1 sm:grid-cols-2 1g:grid-cols-3 gap-4">
            {equipmentList && equipmentList.map(eq => (
              <EquipmentCard key = {eq.equipmentId} equipment = {eq} isSelected = {selectedId === eq.equipmentId} onClick={()=>setSelectedId(eq.equipmentId)}/>
            ))}
          </div>
        )}
        {selectedId && (
          <div className = "mt-6">
            <SensorChart equipmentId={selectedId} />
          </div>
        )}
        <div className="bg-white rounded-lg p-4 shadow-sm mt-6"> 
          <AlertBadge />
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm mt-6"> 
          <MaintenancePanel />
        </div>
      </main>
    </div>
  );
};

export default App;
