import {LayerManager} from "./LayerManager.tsx";
import TotalPanel from "./TotalPanel.tsx";
import {useContext, useEffect, useState} from "react";
import {type Layer, PlanContext} from "../App.tsx";

type TierCalculatorProps = {
    initialLayers: Layer[]
}

function TierCalculator({initialLayers} : TierCalculatorProps) {
    const { length, width, unit, reset } = useContext(PlanContext);
    const [layers, setLayers] = useState<Layer[]>(initialLayers);
    const [totals, setTotals] = useState({ resine: 0, varnish: 0, cost: 0 });

    useEffect(() => {
        setLayers(initialLayers);
    }, [reset]);

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
        <>
            <div className="py-4">
                <LayerManager layers={layers} onLayersChange={setLayers} />
                <TotalPanel totalResine={totals.resine} />
            </div>
        </>
    );
}

export default TierCalculator;