import {useContext} from "react";
import {PlanContext} from "../App.tsx";

type TotalPanelProps = {
    totalResine: number;
}

function TotalPanel({totalResine}: TotalPanelProps) {
    const { length, width,  unit, ratio } = useContext(PlanContext);
    const [partA, partB] = ratio.split(':').map(Number);
    const totalParts : number = partA + partB;
    const weightA : number = (totalResine * partA) / totalParts;
    const weightB : number = (totalResine * partB) / totalParts;

    const formatWeight = (grams: number) => {
        return grams >= 1000
            ? `${(grams / 1000).toFixed(2)} kg`
            : `${grams.toFixed(0)} g`;
    };

    return (
        <>
            <div className="h-24 md:hidden" aria-hidden="true" />
            <div className="fixed bottom-1 left-0 w-full z-50 md:sticky md:mt-auto ">
                {/* Contenedor con fondo y sombra superior para el móvil */}
                <div className="bg-white p-4 shadow-lg md:shadow-0 md:bg-transparent md:shadow-none md:p-0">
                    <div className="bg-white text-slate-800 md:text-white md:bg-cyan-900 p-5 rounded-xl  md:rounded-lg max-w-7xl mx-auto">
                        <div className={"grid grid-cols-2 md:grid-cols-4 gap-4"}>
                            <div>
                                <p className="text-xs md:text-lg opacity-90 uppercase tracking-wider font-semibold">Área total</p>
                                <p className="text-xl md:text-3xl font-bold">
                                    { unit == 'm' ?
                                        `${(length * width).toFixed(2)} m²` :
                                        `${(length * width).toFixed(2)} cm²`
                                    }
                                </p>
                            </div>
                            <div className="text-right md:text-left">
                                <p className="text-xs md:text-lg opacity-90 uppercase tracking-wider font-semibold">Mezcla total</p>
                                <p className="text-xl md:text-3xl font-bold">
                                    { formatWeight(totalResine) }
                                </p>
                            </div>
                            <div>
                                <p className="text-xs md:text-lg opacity-90 uppercase tracking-wider font-semibold">Componente A</p>
                                <p className="text-xl md:text-3xl font-bold">
                                    { formatWeight(weightA) }
                                </p>
                            </div>
                            <div className="text-right md:text-left">
                                <p className="text-xs md:text-lg opacity-90 uppercase tracking-wider font-semibold">Componente B</p>
                                <p className="text-xl md:text-3xl font-bold">
                                    { formatWeight(weightB) }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default TotalPanel;