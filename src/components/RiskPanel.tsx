import React from 'react';
import useFetch from '../hooks/useFetch';

interface RiskAssessment {
    equipmentId: string;
    riskScore: number; //0-100
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    alertCount: number;
    recommandation: string;
}

const riskStyle: Record<RiskAssessment['riskLevel'], {bar: string; badge:string; text:string;}> = {
    LOW: { bar: 'bg-green-400',  badge: 'bg-green-100 text-green-800',  text: 'text-green-700' },
    MEDIUM: { bar: 'bg-yellow-400', badge: 'bg-yellow-100 text-yellow-800',text: 'text-yellow-700' },
    HIGH: { bar: 'bg-orange-400', badge: 'bg-orange-100 text-orange-800',text: 'text-orange-700' },
    CRITICAL: { bar: 'bg-red-500',    badge: 'bg-red-100 text-red-800',      text: 'text-red-700' },
}

const RiskPanel: React.FC = () => {
    const {data:assessments, loading} = useFetch<RiskAssessment[]>('/api/sensor/risk-assessment', 10000);

    if(loading) return <div className="text-gray-400 text-sm">Analyzing risks...</div>;
    if(!assessments?.length) return (
        <div className="text-gray-400 text-sm p-4 bg-gray-50 rounded-lg">
            No risk data available yet. Waiting for sensor data...
        </div>
    )

    return (
        <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-base font-semibold text-gray-700 mb-3">Risk Assessment</h2>
            <ul className="space-y-3">
                {assessments.map(assessment => {
                    const style = riskStyle[assessment.riskLevel];
                    return (
                        <li key={assessment.equipmentId} className="space-y-1">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-800">{assessment.equipmentId}</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
                                    {assessment.riskLevel}
                                </span>
                            </div>
                            {/* risk assessment progress bar */}
                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div className ={`h-1.5 rounded-full transition-all duration-500 ${style.bar}`} style={{width: `${assessment.riskScore}%`}} />
                            </div>
                            <p className={`text-xs ${style.text}`}>{assessment.recommandation}</p>
                        </li>
                    )
                })}

            </ul>

        </div>
    )
}

export default RiskPanel;