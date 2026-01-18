// src/pages/Mid.tsx
import { useContext, useState, useEffect } from 'react';
import {type Layer, PlanContext} from '../App';
import TotalPanel from "../components/TotalPanel.tsx";
import {LayerManager} from "../components/LayerManager.tsx";

function Mid() {
    const { length, width, unit } = useContext(PlanContext);
    const [layers, setLayers] = useState<Layer[]>([
        { id: '1', name: 'Capa Base', thickness: 1, type: 'resin', consumptionPerM2PerMm: 1000, ratio: "2:1", quartzPercentage: 20 },
        { id: '2', name: 'Color', thickness: 2, type: 'resin', consumptionPerM2PerMm: 1000, ratio: "2:1", quartzPercentage: 20 },
        { id: '2', name: 'Protector (sin color)', thickness: 1, type: 'resin', consumptionPerM2PerMm: 1000, ratio: "2:1", quartzPercentage: 0 },
        { id: '3', name: 'Sellador Barniz', thickness: 0.5, type: 'varnish', consumptionPerM2PerMm: 150, ratio: "1:1" }
    ]);
    const [totals, setTotals] = useState({ resine: 0, varnish: 0, cost: 0 });


    useEffect(() => {
        const areaInM2 = unit === 'cm' ? (length * width) / 10000 : (length * width);

        const summary = layers.reduce((acc, layer) => {
            const grams = areaInM2 * layer.thickness * layer.consumptionPerM2PerMm;

            if (layer.type === 'resin') acc.resine += grams;
            if (layer.type === 'varnish') acc.varnish += grams;

            // Supongamos precios base: Resina $45/kg, Barniz $80/kg
            const price = layer.type === 'resin' ? 45 : 80;
            acc.cost += (grams / 1000) * price;

            return acc;
        }, { resine: 0, varnish: 0, cost: 0 });

        setTotals(summary);
    }, [length, width, unit, layers]);

    return (
        <div className="py-4">
            <LayerManager layers={layers} onLayersChange={setLayers} />

            <TotalPanel totalResine={totals.resine} />
        </div>
    );
}

export default Mid;