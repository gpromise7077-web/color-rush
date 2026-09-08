import { useState } from "react";
import { EventBus } from "./game/EventBus";

export default function Stake() {
    const [stake, setstake] = useState<string>("");

    const handleStake = () => {
        const amount = Number(stake);
        if (amount > 0) {
            EventBus.emit("setstake", amount);
            console.log("Stake emitted:", amount);
        }
    };

    const forPClass = (value: string) => {
        const isSelected = stake === value;
        return isSelected
            ? "bg-[#f9c12c] text-[#0e1326] border border-[#f9c12c] font-bold rounded-[9px] cursor-pointer py-1 px-4 transition-transform duration-100 active:scale-90 select-none"
            : "bg-[#1a2036] text-[#657294] border border-[#2f3851] rounded-[9px] cursor-pointer py-1 px-4 hover:text-white transition-transform duration-100 active:scale-90 select-none";
    };

    return (
        <div className="border mt-2 ml-10 items-center justify-center w-85 rounded-[5px] bg-[#0e1326] pb-5">
            <div className="mt-5 ml-5 text-[#2f3851] font-bold">
                <h1>YOUR STAKE</h1>
            </div>

            <div className="flex gap-3 w-[70%] ml-8 mt-10">
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

            <input
                type="number"
                value={stake}
                placeholder="GVT"
                onChange={(e) => setstake(e.target.value)}
                className="flex ml-8 mt-10 border px-3 py-2 rounded-[10px] bg-[#1a2036] border-[#2f3851] text-amber-400 font-bold outline-none focus:border-[#f9c12c]"
                required
            />
            <button
                onClick={handleStake}
                className="bg-[#f9c12c] hover:bg-[#e0ad24] px-19 py-2 rounded-[9px] ml-8 mt-3 text-black font-sans font-bold cursor-pointer transition-transform duration-70 active:scale-95 select-none"
            >
                Stake token
            </button>
        </div>
    );
}

