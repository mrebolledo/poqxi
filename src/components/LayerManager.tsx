import { useContext } from 'react';
import { PlanContext } from "../App"; // Ajusta la ruta según tu estructura
import type {Layer, LayerType} from "../App";

interface LayerManagerProps {
    layers: Layer[];
    onLayersChange: (layers: Layer[]) => void;
}

export function LayerManager({ layers, onLayersChange }: LayerManagerProps) {
    const { length, width, unit, ratio } = useContext(PlanContext);

    const areaInM2 = unit === 'cm' ? (length * width) / 10000 : (length * width);

    const formatWeight = (grams: number) =>
        grams >= 1000 ? `${(grams / 1000).toFixed(2)} kg` : `${grams.toFixed(0)} g`;

    // Nueva función para formatear volumen de líquidos (Top Coat)
    const formatVolume = (ml: number) =>
        ml >= 1000 ? `${(ml / 1000).toFixed(2)} L` : `${ml.toFixed(0)} ml`;

    const calculateLayerDetails = (layer: Layer) => {
        if (layer.type === 'varnish') {
            // Lógica Top Coat: 1 galón (3785ml) rinde 40m2
            // Proporcional al espesor si fuera necesario, pero usualmente es por área.
            // Si el espesor influye: (area / 40) * 3785 * (layer.thickness / espesor_base)
            // Aquí lo haremos por área estándar:
            const totalMl = (areaInM2 / 40) * 3785;
            return { totalMl };
        }

        const totalWeight = areaInM2 * layer.thickness * layer.consumptionPerM2PerMm;
        const [partA, partB] = ratio.split(':').map(Number);
        const totalParts = partA + partB;

        const weightA = totalParts > 0 ? (totalWeight * partA) / totalParts : 0;
        const weightB = totalParts > 0 ? (totalWeight * partB) / totalParts : 0;
        const quartzWeight = layer.quartzPercentage ? (totalWeight * layer.quartzPercentage) / 100 : 0;

        return { weightA, weightB, quartzWeight, partA, partB };
    };

    const addLayer = (e: React.MouseEvent) => {
        e.preventDefault();
        const newLayer: Layer = {
            id: crypto.randomUUID(),
            name: `Capa ${layers.length + 1}`,
            thickness: 1,
            type: 'resin',
            consumptionPerM2PerMm: 1000,
            ratio: "2:1",
            quartzPercentage: 0
        };
        onLayersChange([...layers, newLayer]);
    };

    const removeLayer = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        onLayersChange(layers.filter(l => l.id !== id));
    };

    const updateLayer = (id: string, updates: Partial<Layer>) => {
        onLayersChange(layers.map(l => l.id === id ? { ...l, ...updates } : l));
    };

    return (
        <div className="space-y-2 mb-5">
            <div className="flex justify-between items-center px-2">
                <h3 className="text-xl font-bold text-slate-800">Estructura del capas</h3>
                <button
                    type="button"
                    onClick={addLayer}
                    className="bg-cyan-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-cyan-700 transition-colors shadow-sm"
                >
                    + Añadir Capa
                </button>
            </div>

            {layers.map((layer) => {
                const details = calculateLayerDetails(layer);

                return (
                    <div key={layer.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm  group">
                        {/* ... delete button code ... */}

                        <div className="p-4 relative border-b border-slate-50 bg-slate-50/30 flex justify-between">
                            <input
                                value={layer.name}
                                onChange={(e) => updateLayer(layer.id, { name: e.target.value })}
                                className="bg-transparent font-bold text-slate-700 outline-none focus:ring-2 ring-cyan-500 rounded px-2 py-1  w-[50%]"
                            />
                            <div>
                                <select
                                    value={layer.type}
                                    onChange={(e) => updateLayer(layer.id, { type: e.target.value as LayerType })}
                                    className="text-[10px] font-black uppercase px-2 py-1 bg-white border border-slate-200 rounded-md text-slate-600"
                                >
                                    <option value="resin">Resina</option>
                                    <option value="varnish">Top Coat</option>
                                </select>
                                <button
                                    type="button"
                                    onClick={(e) => removeLayer(layer.id, e)}
                                    className="absolute top-4 right-30 text-red-500 transition-colors p-1 z-10 cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                                        {layer.type === 'resin' ? 'Espesor (mm)' : 'Capas (Cantidad)'}
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={layer.thickness}
                                        onChange={(e) => updateLayer(layer.id, { thickness: parseFloat(e.target.value) || 0 })}
                                        className="w-full text-lg font-semibold outline-none border-b border-slate-100 focus:border-cyan-500"
                                    />
                                </div>
                                {layer.type === 'resin' && (
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">% Cuarzo</label>
                                        <input type="number" value={layer.quartzPercentage || 0} onChange={(e) => updateLayer(layer.id, { quartzPercentage: parseInt(e.target.value) || 0 })} className="w-full text-lg font-semibold outline-none border-b border-slate-100 focus:border-cyan-500" />
                                    </div>
                                )}
                            </div>

                            <div className="md:col-span-2 bg-slate-50 rounded-2xl p-4 flex flex-col justify-center border border-slate-100">
                                {layer.type === 'varnish' ? (
                                    <div className="text-center">
                                        <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Rendimiento Estimado (40m²/gal)</p>
                                        <p className="text-3xl font-bold text-slate-800">{formatVolume(details.totalMl! * layer.thickness)}</p>
                                        <p className="text-xs text-slate-400 mt-1">Basado en {areaInM2.toFixed(2)} m²</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase text-cyan-600 mb-1">Comp. A ({details.partA})</p>
                                            <p className="text-xl font-bold text-cyan-900">{formatWeight(details.weightA!)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase text-cyan-600 mb-1">Comp. B ({details.partB})</p>
                                            <p className="text-xl font-bold text-cyan-900">{formatWeight(details.weightB!)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase text-cyan-600 mb-1">Total</p>
                                            <p className="text-xl font-bold text-cyan-900">{formatWeight(details.weightB!+details.weightA!)}</p>
                                        </div>
                                        {details.quartzWeight! > 0 && (
                                            <div className="col-span-2 pt-2 border-t border-cyan-100">
                                                <p className="text-[10px] font-bold uppercase text-orange-600 mb-1">Cuarzo ({layer.quartzPercentage}%)</p>
                                                <p className="text-lg font-bold text-orange-900">{formatWeight(details.quartzWeight!)}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}