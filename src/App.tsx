import Header from "./partials/Header.tsx";
import { Outlet } from "react-router";
import { useState, createContext } from 'react';

type Ratios = '2:1' | '1:1' | '3:1';

export type LayerType = 'resin' | 'varnish';

export interface Layer {
    id: string;
    name: string;
    thickness: number;
    type: LayerType;
    consumptionPerM2PerMm: number;
    ratio: Ratios; // ej: "2:1"
    quartzPercentage?: number; // 0 a 100
}
// Crear un contexto para compartir las dimensiones entre rutas
export const PlanContext = createContext({
    length: 0,
    width: 0,
    unit: 'm' as 'm' | 'cm',
    setLength: (_value: number) => {},
    setWidth: (_value: number) => {},
    setUnit: (_value: 'm' | 'cm') => {},
    ratio : '2:1' as Ratios,
    setRatio: (_value: Ratios) => {}
});

function App() {
    const [length, setLength] = useState<number>(0);
    const [width, setWidth] = useState<number>(0);
    const [unit, setUnit] = useState<'m' | 'cm'>('m');
    const [ratio, setRatio] = useState<Ratios>('2:1');

    const totalArea : number = length * width;

    return (
        <PlanContext.Provider value={{ length, width, unit, setLength, setWidth, setUnit, ratio, setRatio }}>
            <div className="bg-cyan-700 w-full min-h-screen">
                <div className="w-[95%] md:w-[60%] mx-auto py-4">
                    <Header />
                    <div className="mt-4 bg-white rounded-lg h-[calc(100vh-120px)] overflow-auto shadow-2xl">
                        <div className="mb-4 p-4 border-b border-slate-100">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Dimensiones</h2>
                                <div className="flex bg-slate-100 p-1 rounded-lg">
                                    <button
                                        onClick={() => setUnit('m')}
                                        className={`px-4 py-1 rounded-md text-sm font-bold transition-colors ${unit === 'm' ? 'bg-white text-cyan-700 shadow-sm' : 'text-slate-500'}`}
                                    >
                                        Metros
                                    </button>
                                    <button
                                        onClick={() => setUnit('cm')}
                                        className={`px-4 py-1 rounded-md text-sm font-bold transition-colors ${unit === 'cm' ? 'bg-white text-cyan-700 shadow-sm' : 'text-slate-500'}`}
                                    >
                                        cm
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Tipo Resina</h2>
                                <div className="flex bg-slate-100 p-1 rounded-lg">
                                    <button
                                        onClick={() => setRatio('2:1')}
                                        className={`px-4 py-1 rounded-md text-sm font-bold transition-colors ${ratio === '2:1' ? 'bg-white text-cyan-700 shadow-sm' : 'text-slate-500'}`}
                                    >
                                        2:1
                                    </button>
                                    <button
                                        onClick={() => setRatio('1:1')}
                                        className={`px-4 py-1 rounded-md text-sm font-bold transition-colors ${ratio === '1:1' ? 'bg-white text-cyan-700 shadow-sm' : 'text-slate-500'}`}
                                    >
                                        1:1
                                    </button>
                                    <button
                                        onClick={() => setRatio('3:1')}
                                        className={`px-4 py-1 rounded-md text-sm font-bold transition-colors ${ratio === '3:1' ? 'bg-white text-cyan-700 shadow-sm' : 'text-slate-500'}`}
                                    >
                                        3:1
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="length" className="block mb-1 text-sm font-medium text-slate-600">
                                        Largo ({unit === 'm' ? 'metros' : 'centímetros'}):
                                    </label>
                                    <input
                                        id="length"
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        value={length || ''}
                                        onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                                        className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="width" className="block mb-1 text-sm font-medium text-slate-600">
                                        Ancho ({unit === 'm' ? 'metros' : 'centímetros'}):
                                    </label>
                                    <input
                                        id="width"
                                        type="number"
                                        step="0.1"
                                        value={width || ''}
                                        onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                                        className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-cyan-50 border border-cyan-100 rounded-xl flex justify-between items-center">
                                <span className="text-cyan-800 font-medium">Área en { unit == "m"? "metros" : "centímetros"}:</span>
                                <span className="text-cyan-900 font-bold text-lg">
                                    {totalArea.toFixed(2)} {unit == "m"? "m²" :"cm²"}
                                </span>
                            </div>
                            {
                                unit === 'cm' &&
                                <div className="mt-1 p-3 bg-cyan-50 border border-cyan-100 rounded-xl flex justify-between items-center">
                                    <span className="text-cyan-800 font-medium">Área en metros:</span>
                                    <span className="text-cyan-900 font-bold text-lg">
                                        { ((totalArea / 10000).toFixed(2))} m²
                                    </span>
                                </div>
                            }
                        </div>

                        <div className="px-4 relative">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </PlanContext.Provider>
    )
}

export default App;