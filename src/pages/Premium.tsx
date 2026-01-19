// src/pages/Premium.tsx
import {type Layer} from '../App';
import TierCalculator from "../components/TierCalculator.tsx";



function Premium() {
    const premiumLayers : Layer[] = [
        { id: '1', name: 'Capa Base', thickness: 1, type: 'resin', consumptionPerM2PerMm: 1000, ratio: "2:1", quartzPercentage: 40 },
        { id: '2', name: 'Color', thickness: 3, type: 'resin', consumptionPerM2PerMm: 1000, ratio: "2:1", quartzPercentage: 40 },
        { id: '3', name: 'Protector (sin color)', thickness: 2, type: 'resin', consumptionPerM2PerMm: 1000, ratio: "2:1", quartzPercentage: 0 },
        { id: '4', name: 'Sellador (primera mano)', thickness: 0.5, type: 'varnish', consumptionPerM2PerMm: 150, ratio: "1:1" },
        { id: '5', name: 'Sellador (segunda mano)', thickness: 0.5, type: 'varnish', consumptionPerM2PerMm: 150, ratio: "1:1" }
    ]

    return (<TierCalculator initialLayers={premiumLayers} />);
}

export default Premium;