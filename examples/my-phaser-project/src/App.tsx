import { useRef } from "react";
import { IRefPhaserGame, PhaserGame } from "./PhaserGame";
import "./App.css";
import Stake from "./stake";
function App() {
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    return (
        <div id="app">
            <div className="w-full h-full flex">
                <Stake />
                <div id="game-container" className="w-[80%] h-full">
                    <PhaserGame ref={phaserRef} />
                </div>
            </div>
        </div>
    );
}

export default App;
