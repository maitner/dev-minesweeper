import { useState, useEffect } from "react";
import { GAMESTATE } from "./state";
import { IconReset } from "./icons";

export default function Header( {gameState,handleReset,mineCount,flagCount,timeStampStart,timeStampEnd} ){
    const flags = (mineCount - flagCount);

    const [now,setNow] = useState( Date.now() );

    //when game is running initalize setinterval and refresh counter every 250ms 
    useEffect(() => {
        if( gameState == GAMESTATE.RUNNING ){
            const interval = setInterval(() => {
                setNow( n => Date.now() );
            }, 250);
            return () => clearInterval(interval);
        }
    }, [gameState]);

    let time = 0;

    if( gameState == GAMESTATE.RUNNING ){
        time = Math.floor( (now - timeStampStart) / 1000 );
    } else if( gameState == GAMESTATE.CLEARED || gameState == GAMESTATE.DEAD ){
        time = Math.floor( (timeStampEnd - timeStampStart) / 1000 );
    }
    
    //time can be -1 when now is smaller then start timestamp and that can happen because of state managemnet fun; smooths the start
    time = Math.max(time,0);

    return <div className="header">
        <div className="header-flags">{flags}</div>
        <div className="header-reset"><button onClick={handleReset}><IconReset/></button></div>
        <div className="header-time">{time}</div>
    </div>
}