import HeaderButton from "../components/HeaderButton.tsx";
import {useContext} from "react";
import {PlanContext} from "../App.tsx";

function Header () {
    const {handleReset} = useContext(PlanContext);
    return (
        <div className={"flex justify-between py-4"}>
            <h1 className={"text-white text-4xl font-bold mt-0 md:mt-2"}>
                Poqxi
            </h1>
            <div className={"bg-white p-3 rounded-md"}>
                <button className={"hidden md:inline py-2 px-5 md:p-2 border-0 ml-2 hover:bg-cyan-900 hover:text-white rounded-full md:rounded-md transition-colors bg-red-400 font-bold text-white "} onClick={() => handleReset()}>Reiniciar valores</button>
                <HeaderButton path={"economy"} label={"Economy"} />
                <HeaderButton path={"mid"} label={"Mid"} />
                <HeaderButton path={"premium"} label={"Premium"} />
            </div>
        </div>
    );
}

export default Header;