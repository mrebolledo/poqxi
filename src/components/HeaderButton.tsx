import { Link, useLocation } from "react-router";

type HeaderButtonProps = {
    path: string;
    label: string;
}


function HeaderButton({path, label} : HeaderButtonProps) {
    const location = useLocation();
    const currentPath = location.pathname;

    // Verificar si esta ruta está activa
    const active = currentPath === `/${path}`;

    // Aplicar clases condicionales según si está activo o no
    const activeClasses = active ? "bg-cyan-900 font-bold text-white" : "bg-white text-black";

    const firstLetter = label.charAt(0);
    const restOfText = label.substring(1);

    return (
        <Link
            to={`/${path}`}
            className={`py-2 px-5 md:p-2 border-0 ml-2 hover:bg-cyan-900 hover:text-white rounded-full md:rounded-md transition-colors ${activeClasses}`}
        >
            <span className="font-bold md:font-semibold">{firstLetter}</span>
            <span className="sm:inline hidden">{restOfText}</span>
        </Link>
    );
}

export default HeaderButton;