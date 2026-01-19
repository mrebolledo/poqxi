// src/pages/Economy.tsx
import {type Layer} from '../App';
import TierCalculator from "../components/TierCalculator.tsx";



function Economy() {
    const EconomyLayers : Layer[] = [
        { id: '1', name: 'Capa Base', thickness: 0.5, type: 'resin', consumptionPerM2PerMm: 1000, ratio: "2:1", quartzPercentage: 0 },
        { id: '2', name: 'Color', thickness: 2, type: 'resin', consumptionPerM2PerMm: 1000, ratio: "2:1", quartzPercentage: 0 },
        { id: '3', name: 'Sellador Resina', thickness: 1, type: 'resin', consumptionPerM2PerMm: 1000, ratio: "2:1" }
    ];

    return (<TierCalculator initialLayers={EconomyLayers}/>);
}

export default Economy;