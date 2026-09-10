import { useState, useEffect } from "react";
import { EventBus } from "./game/EventBus";

export default function Stake() {
    const [stake, setstake] = useState<string>("");
    const [choosenColor, setChoosenColor] = useState<string | null>(null);
    const [index, setIndex] = useState<number | null>(null);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const handleRoundEnd = () => {
            setstake("");
            setChoosenColor(null);
            setIndex(null);
        };

        const handleColorChosen = (value: { color: string; index: number }) => {
            setChoosenColor(value.color);
            setIndex(value.index);
            setError(""); // clear the error once they've picked a color
        };

        EventBus.on("round-End", handleRoundEnd);
        EventBus.on("color-choosen", handleColorChosen);

        return () => {
            EventBus.off("round-End", handleRoundEnd);
            EventBus.off("color-choosen", handleColorChosen);
        };
    }, []);

    const handleStake = () => {
        const amount = Number(stake);

        if (index === null) {
            setError("Please choose a color before staking!");
            return;
        }

        if (amount <= 0) {
            setError("Please enter a valid stake amount!");
            return;
        }

        setError("");
        EventBus.emit("setstake", { amount, index });
    };

    const forPClass = (value: string) => {
        const isSelected = stake === value;
        return isSelected
            ? "bg-[#f9c12c] text-[#0e1326] border border-[#f9c12c] font-bold rounded-[9px] cursor-pointer py-1 px-4 transition-transform duration-100 active:scale-90 select-none"
            : "bg-[#1a2036] text-[#657294] border border-[#2f3851] rounded-[9px] cursor-pointer py-1 px-4 hover:text-white transition-transform duration-100 active:scale-90 select-none";
    };

    return (
        <div className="border items-center justify-center w-[95%] rounded-[5px] bg-[#0e1326] pb-5">
            <img
                src="/assets/gamelogo.png"
                alt=""
                className="hidden lg:block lg:absolute lg:w-50 lg:top-25 lg:left-5"
            />
            <div className="mt-10 ml-25 text-[#2f3851] font-bold md:w-fit">
                <h1>YOUR STAKE</h1>
            </div>

            <div className="flex gap-3 w-[70%] ml-8 mt-10 md:items-center md:justify-center">
                <p onClick={() => setstake("1")} className={forPClass("1")}>
                    1
                </p>
                <p onClick={() => setstake("5")} className={forPClass("5")}>
                    5
                </p>
                <p onClick={() => setstake("10")} className={forPClass("10")}>
                    10
                </p>
                <p onClick={() => setstake("50")} className={forPClass("50")}>
                    50
                </p>
            </div>

            {choosenColor ? (
                <div className="ml-8 flex gap-2 items-center mt-2">
                    You Choose{" "}
                    <div
                        style={{ backgroundColor: choosenColor }}
                        className="w-4 h-4"
                    ></div>
                </div>
            ) : (
                <div className="ml-8 mt-2">Choose A Color</div>
            )}

            <input
                type="number"
                value={stake}
                placeholder="GVT"
                onChange={(e) => setstake(e.target.value)}
                className="flex md:items-center md:justify-center ml-8 mt-2 border px-3 py-2 rounded-[10px] bg-[#1a2036] border-[#2f3851] text-amber-400 font-bold outline-none focus:border-[#f9c12c]"
                required
            />

            {error && <p className="text-red-500 text-sm ml-8 mt-2">{error}</p>}

            <button
                onClick={handleStake}
                className="bg-[#f9c12c] md:items-center md:justify-center hover:bg-[#e0ad24] px-19 py-2 rounded-[9px] ml-8 mt-3 text-black font-sans font-bold cursor-pointer transition-transform duration-70 active:scale-95 select-none"
            >
                Stake token
            </button>
        </div>
    );
}

