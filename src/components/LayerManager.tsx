import { useContext } from 'react';
import { PlanContext } from "../App"; // Ajusta la ruta según tu estructura
import type {Layer, LayerType} from "../App";
import * as React from "react";

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
            // 1 mm de espesor = 1 litro por m²
            const totalMl = areaInM2 * layer.thickness * 1000;
            return { totalMl };
        }


        const totalWeight = areaInM2 * layer.thickness * layer.consumptionPerM2PerMm;
        const [partA, partB] = ratio.split(':').map(Number);
        const totalParts = partA + partB;

        const weightA = totalParts > 0 ? (totalWeight * partA) / totalParts : 0;
        const weightB = totalParts > 0 ? (totalWeight * partB) / totalParts : 0;
        const quartzWeight = layer.quartzPercentage ? (totalWeight * layer.quartzPercentage) / 100 : 0;

        return { weightA, weightB, quartzWeight, partA, partB, totalWeight };
    };

    const addColor = (layerId: string) => {
        const layer = layers.find(l => l.id === layerId);
        if (!layer) return;
        const currentColors = layer.colors || [];
        updateLayer(layerId, {
            colors: [...currentColors, { id: crypto.randomUUID(), name: `Color ${currentColors.length + 1}`, percentage: 0 }]
        });
    };

    const updateColor = (layerId: string, colorId: string, updates: any) => {
        const layer = layers.find(l => l.id === layerId);
        if (!layer) return;
        const newColors = layer.colors?.map(c => c.id === colorId ? { ...c, ...updates } : c);
        updateLayer(layerId, { colors: newColors });
    };

    const removeColor = (layerId: string, colorId: string) => {
        const layer = layers.find(l => l.id === layerId);
        if (!layer) return;
        updateLayer(layerId, { colors: layer.colors?.filter(c => c.id !== colorId) });
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
                    className="cursor-pointer bg-cyan-900 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-cyan-700 transition-colors shadow-sm"
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
                                        min="0"
                                        step="0.1"
                                        value={layer.thickness || ''}
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

                            <div className="md:col-span-2 space-y-4">
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                    {layer.type === 'varnish' ? (
                                        <div className="text-center">
                                            <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Rendimiento Estimado (1m²/L)</p>
                                            <p className="text-3xl font-bold text-slate-800">{formatVolume(details.totalMl!)}</p>
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

                                {/* Sección de Colores */}
                                {layer.type === 'resin' && (
                                    <div className="bg-white border border-slate-100 rounded-xl p-3">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="text-xs font-bold uppercase text-slate-500">Distribución de Colores / Mezclas</h4>
                                            <button 
                                                onClick={() => addColor(layer.id)}
                                                className="text-[10px] bg-cyan-50 text-cyan-700 hover:bg-cyan-100 px-2 py-1 rounded font-bold transition-colors"
                                            >
                                                + Añadir Color
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {layer.colors?.map((color) => {
                                                const colorTotalWeight = (details.totalWeight! * (color.percentage || 0)) / 100;
                                                const colorWeightA = (colorTotalWeight * details.partA!) / (details.partA! + details.partB!);
                                                const colorWeightB = (colorTotalWeight * details.partB!) / (details.partA! + details.partB!);

                                                return (
                                                    <div key={color.id} className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <input 
                                                                className="text-sm w-[30%] font-bold bg-transparent border-b border-slate-200 focus:border-cyan-500 outline-none flex-1"
                                                                value={color.name}
                                                                onChange={(e) => updateColor(layer.id, color.id, { name: e.target.value })}
                                                            />
                                                            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-slate-100">
                                                                <input 
                                                                    type="number"
                                                                    className="w-10 text-right text-sm font-black text-cyan-600 bg-transparent outline-none"
                                                                    value={color.percentage || ''}
                                                                    onChange={(e) => updateColor(layer.id, color.id, { percentage: parseFloat(e.target.value) || 0 })}
                                                                />
                                                                <span className="text-[10px] font-bold text-slate-400">%</span>
                                                            </div>
                                                            <button onClick={() => removeColor(layer.id, color.id)} className="text-red-300 hover:text-red-500 transition-colors">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-3 gap-2">
                                                            <div className="text-center bg-white/50 py-1 rounded">
                                                                <p className="text-[8px] uppercase font-bold text-slate-400">A ({details.partA})</p>
                                                                <p className="text-xs font-bold text-slate-700">{formatWeight(colorWeightA)}</p>
                                                            </div>
                                                            <div className="text-center bg-white/50 py-1 rounded">
                                                                <p className="text-[8px] uppercase font-bold text-slate-400">B ({details.partB})</p>
                                                                <p className="text-xs font-bold text-slate-700">{formatWeight(colorWeightB)}</p>
                                                            </div>
                                                            <div className="text-center bg-cyan-100/50 py-1 rounded border border-cyan-100">
                                                                <p className="text-[8px] uppercase font-bold text-cyan-600">Total</p>
                                                                <p className="text-xs font-black text-cyan-700">{formatWeight(colorTotalWeight)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
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