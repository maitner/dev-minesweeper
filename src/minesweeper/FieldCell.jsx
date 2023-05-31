import { GAMESTATE } from "./state";

import { IconMine, IconFlag  } from "./icons";

export default function FieldCell({field,gameState,handleFieldSweepClick,handleFieldFlagClick}){

    let content = "";

    const fieldClass = ["field"];

    if( field.sweeped ){
        if( field.hasMine ){
            fieldClass.push( "field-sweeped-mine" );
        } else if ( field.adjacentMines > 0 ) {
            fieldClass.push( "field-sweeped-adjacent" );
        } else {
            fieldClass.push( "field-sweeped-empty" );
        }
    } else {
        fieldClass.push( "field-unsweeped" );
    }


    if( field.sweeped ){
        if( field.hasMine ){
            content = <IconMine />;
        } else if ( field.adjacentMines > 0 ) {
            content = field.adjacentMines;
        }
    } else {
        if(field.hasFlag){
            content = <IconFlag />
        }
    }

    //when game is finished and player foubnd all mines show mine in every uncleared field
    if( gameState == GAMESTATE.CLEARED && !field.sweeped && field.hasMine ){
        content = <IconMine />;
    }

    function handleOnClick(e){
        handleFieldSweepClick(field.id)
    }

    function handleOnContextMenu(e){
        e.preventDefault();
        handleFieldFlagClick(field.id)
    }

    return  <div className={ fieldClass.join(" ") } onClick={handleOnClick} onContextMenu={handleOnContextMenu}>{content}</div>
}