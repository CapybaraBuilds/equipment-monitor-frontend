import React, { useEffect, Suspense } from 'react'
import EquipmentCard from './components/EquipmentCard';
// import useFetch from './hooks/useFetch';
// import type {Equipment} from './types';
import { useEquipment } from './context/EquipmentContext';
import AlertBadge from './components/AlertBadge';
import MaintenancePanel from './components/MaintenancePanel';
import RiskPanel from './components/RiskPanel';
// import { getEquipmentList, getLatestSensorData, getSensorHistory } from './api/client';
const SensorChart = React.lazy(() => import('./components/SensorChart'));

const App: React.FC = () => {
  // const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  // const [selectedId, setSelectedId] = useState<string | null>(null);

  // const {data: equipmentList, loading, error} = useFetch<Equipment[]>('/api/equipment', 5000);
  const {equipmentList, selectedId, setSelectedId, loading} = useEquipment();
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

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500">Loading equipment data...</p>
    </div>
  )

  return (
    <div className = "min-h-screen bg-gray-100">
      <header className = "bg-gray-900 text-white px-6 py-4">
        <h1 className = "text-xl font-bold">Industrial Equipment Monitor</h1>
        <span className="text-sm text-green-400 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Live · {equipmentList?.length ?? 0} devices
        </span>
      </header>

      <div className="flex h-[calc(100vh-60px)]">
        {/* Left sidebar: device list (fixed width, scrollable) */}
        <aside className="w-72 bg-white border-r border-gray-200 overflow-y-auto p-4 space-y-3 flex-shrink-0">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Equipment ({equipmentList?.length ?? 0})
          </h2>
          {equipmentList?.map(eq => (
              <EquipmentCard key = {eq.equipmentId}
              equipmentId = {eq.equipmentId} name = {eq.name} location = {eq.location} status = {eq.status}
              isSelected = {selectedId === eq.equipmentId}
              onClick={setSelectedId}/>
            ))}
        </aside>

        {/* Right sidebar: main content area (scrollable) */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top: Real-time sensor chart */}
          <Suspense fallback = {
            <div className = "bg-white rounded-lg p-8 text-center text-gray-400 animate-pulse">
              Loading chart...
            </div>
          }>
            {selectedId && <SensorChart equipmentId={selectedId} />}
          </Suspense>
          {/* Bottom: three-column grid - alerts, maintenance, rist assessment */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AlertBadge />
            <MaintenancePanel />
            <RiskPanel />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
