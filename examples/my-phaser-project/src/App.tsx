import { useRef } from "react";
import { IRefPhaserGame, PhaserGame } from "./PhaserGame";
import "./App.css";
import Stake from "./stake";

function App() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    return (
        <div
            id="app"
            className="min-h-screen bg-[#060812] flex flex-col items-center justify-center p-4"
        >
            <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-8">
                {/* 1. Game Canvas Area */}
                <div
                    id="game-container"
                    className="w-full md:w-[65%] lg:w-[70%] order-1 md:order-2 flex justify-center items-center overflow-hidden rounded-xl border border-slate-800 shadow-2xl"
                >
                    <PhaserGame ref={phaserRef} />
                </div>

                {/* 2. Stake Control Area */}
                <div className="w-full md:w-[35%] lg:w-[30%] order-2 md:order-1 flex justify-center">
                    <Stake />
                </div>
            </div>
        </div>
    );
}

export default App;
