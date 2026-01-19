import HeaderButton from "../components/HeaderButton.tsx";
import {useContext} from "react";
import {PlanContext} from "../App.tsx";

function Header () {
    const {handleReset,handlePdfTrigger} = useContext(PlanContext);

    return (
        <div className={"flex justify-between items-center py-4"}>
            <h1 className={"text-white text-4xl font-bold"}>
                Poqxi
            </h1>

            <div className="flex items-center gap-2"> {/* Contenedor que agrupa ambos grupos de botones */}
                {/* Botones de Acción */}
                <div className={'p-1 hidden md:flex items-center bg-white/20 rounded-md backdrop-blur-sm'}>
                    <button
                        className={"hidden md:inline cursor:pointer py-2 px-4 border-0 hover:bg-red-800 rounded-md transition-colors bg-red-700 font-bold text-white text-sm"}
                        onClick={() => handlePdfTrigger()}
                    >
                        PDF
                    </button>
                    <button
                        className={"hidden md:inline cursor:pointer py-2 px-4 border-0 ml-1 hover:bg-yellow-900 rounded-md transition-colors bg-yellow-400 font-bold text-white text-sm"}
                        onClick={() => handleReset()}
                    >
                        Reiniciar
                    </button>
                </div>

                {/* Botones de Navegación */}
                <div className={"bg-white p-1 rounded-md flex gap-1"}>
                    <HeaderButton path={"economy"} label={"Economy"} />
                    <HeaderButton path={"mid"} label={"Mid"} />
                    <HeaderButton path={"premium"} label={"Premium"} />
                </div>
            </div>
        </div>
    );
}

export default Header;