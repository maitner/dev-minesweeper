import { useReducer, useEffect } from 'react';

import { initialState, reducer } from "./state"
import Fields from "./Fields";
import Header from './Header';

const localStorageKey = "minesweeper_state";

function initalizeGameState(state){

    const storedStateData = localStorage.getItem(localStorageKey);

    //in a real app, there should be some stored data versioning
    //maybe if the game is in a cleared|dead state there is no need to load
    if(storedStateData){
        return JSON.parse(storedStateData);
    }

    return state;
}

export default function MinesweeperApp() {

    const [state,dispatch] = useReducer( reducer, initialState(), initalizeGameState );

    useEffect(() => {
        localStorage.setItem(localStorageKey, JSON.stringify(state));
    }, [state]);

    function handleFieldSweepClick(id){
        dispatch( {type:"field_sweep",fieldId:id} )
    }

    function handleFieldFlagClick(id){
        dispatch( {type:"field_flag",fieldId:id} )
    }

    function handleReset(id){
        dispatch( {type:"reset"} )
    }

    let flagCount = 0;
    
    for( let f of state.fields ){
        if(f.hasFlag){
            flagCount++
        }
    }

    return (<div className="game">
        <Header 
            handleReset={handleReset}
            mineCount={state.mineCount}
            flagCount={flagCount}
            gameState={state.gameState}
            timeStampStart={state.timeStampStart}
            timeStampEnd={state.timeStampEnd}
        />
        <Fields 
            sizeX={state.sizeX}
            sizeY={state.sizeY}
            fields={state.fields}
            gameState={state.gameState}
            handleFieldSweepClick={handleFieldSweepClick}
            handleFieldFlagClick={handleFieldFlagClick}
        />
    </div>)

}