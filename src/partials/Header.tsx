import HeaderButton from "../components/HeaderButton.tsx";

function Header () {

    return (
        <div className={"flex justify-between py-4"}>
            <h1 className={"text-white text-4xl font-bold"}>Poqxi</h1>
            <div className={"bg-white p-3 rounded-md"}>
                <HeaderButton path={"economy"} label={"Economy"} />
                <HeaderButton path={"mid"} label={"Mid"} />
                <HeaderButton path={"premium"} label={"Premium"} />
            </div>
        </div>
    );
}

export default Header;