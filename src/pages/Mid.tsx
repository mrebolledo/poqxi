// src/pages/Mid.tsx
import {type Layer} from '../App';
import TierCalculator from "../components/TierCalculator.tsx";




function Mid() {
    const midLayers : Layer[] = [
        { id: '1', name: 'Capa Base', thickness: 1, type: 'resin', consumptionPerM2PerMm: 1000, ratio: "2:1", quartzPercentage: 20 },
        { id: '2', name: 'Color', thickness: 2, type: 'resin', consumptionPerM2PerMm: 1000, ratio: "2:1", quartzPercentage: 20 },
        { id: '3', name: 'Protector (sin color)', thickness: 1, type: 'resin', consumptionPerM2PerMm: 1000, ratio: "2:1", quartzPercentage: 0 },
        { id: '4', name: 'Sellador Barniz', thickness: 0.5, type: 'varnish', consumptionPerM2PerMm: 150, ratio: "1:1" }
    ];

    return (<TierCalculator initialLayers={midLayers} />);
}

export default Mid;