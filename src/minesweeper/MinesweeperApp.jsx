import { useReducer } from 'react';

import { initalState, reducer } from "./state"
import Fields from "./Fields";
import Header from './Header';

export default function MinesweeperApp() {

    const [state,dispatch] = useReducer( reducer, initalState() );


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