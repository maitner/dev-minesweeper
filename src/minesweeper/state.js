export const GAMESTATE = {
    NEW: "new",
    RUNNING: "running",
    CLEARED: "cleared",
    DEAD: "dead",
}

const DEFAULT_SIZE_X = 10;
const DEFAULT_SIZE_Y = 10;
const DEFAULT_MINE_COUNT = 10;


export function initialState(){

    const sizeX = DEFAULT_SIZE_X;
    const sizeY = DEFAULT_SIZE_Y;
    const mineCount = DEFAULT_MINE_COUNT;
    
    const initalState = {
        sizeX,
        sizeY,
        mineCount,
        fields: generateEmptyField(sizeX,sizeY),
        gameState: GAMESTATE.NEW,
        timeStampStart: null,
        timeStampEnd: null,
    };

    return initalState;
}

//empty inital state
export function generateEmptyField(sizeX,sizeY){
    const fields = [];
    for( let y = 0; y < sizeY; y++ ){
        for( let x = 0; x<sizeX; x++ ){
            const id = ( y * sizeY ) + x;
            const field = {
                id,
                hasFlag: false,
                hasMine: false,
                sweeped: false,
                adjacentMines: 0
            }
            fields[id] = field;
        }
    }
    return fields;
}

//after first click, generate mines and stuff
export function generateMineField( sizeX, sizeY, mineCount, initalClickFieldId ){

    const fields = generateEmptyField(sizeX, sizeY);

    const mineIds = [];

    while( mineIds.length < mineCount ){
        const randomId = Math.floor(Math.random() * fields.length);
        if( randomId == initalClickFieldId || mineIds.includes(randomId)){
            continue;
        }
        mineIds.push( randomId );
    }

    for( let m of mineIds ){
        fields[m].hasMine = true;

        for( let a of getAdjacentFieldIds(sizeX, sizeY, m) ){
            fields[a].adjacentMines++;
        }
    }

    return fields;
}

export function getFieldCoordinates(sizeX,sizeY,id){
    const x = id % sizeY;
    const y = (id - x)/sizeY;
    return {x,y}
}

export function getFieldId(sizeX,sizeY, x,y){
    return ( y * sizeY ) + x;
}

export function getAdjacentFieldIds(sizeX,sizeY,id){
    const {x,y} = getFieldCoordinates(sizeX,sizeY,id);

    const adjacentIds = [];

    for( let iy = Math.max(0,y-1); iy <= Math.min( sizeY - 1, y + 1 ); iy++ ){
        for( let ix = Math.max(0,x-1); ix <= Math.min( sizeX - 1, x + 1 ); ix++ ){
            if( ix == x && iy == y){
                continue;
            }
            adjacentIds.push( getFieldId( sizeX, sizeY, ix, iy ) );
        }
    }

    return adjacentIds;
}






export function reducer(state, action){

    switch( action.type ){
        
        case "field_sweep":
            if( state.gameState !== GAMESTATE.NEW && state.gameState !== GAMESTATE.RUNNING ){
                return state;
            }
            if( state.gameState == GAMESTATE.RUNNING ){
                if( state.fields[action.fieldId].sweeped || state.fields[action.fieldId].hasFlag){
                    return state;
                }
            }

            let newState = {...state};
            
            if( state.gameState == GAMESTATE.NEW ){
                newState = {...newState, 
                    gameState: GAMESTATE.RUNNING,
                    timeStampStart: Date.now(), 
                    fields: generateMineField(state.sizeX, state.sizeY, state.mineCount, action.fieldId)
                }
            }

            newState = reducerFieldSweep(newState,action.fieldId);

            return newState;

        break;

        case "field_flag":
            if( state.gameState !== GAMESTATE.RUNNING ){
                return state;
            }
            if( state.fields[action.fieldId].sweeped ){
                return state;
            }
            return {
                ...state,
                fields: state.fields.map( f => {
                    if( f.id == action.fieldId ){
                        return {...f, hasFlag: !f.hasFlag }
                    } else {
                        return f;
                    }
                })
            }

        break;

        case "reset":
            return initialState();
        break;
    }


    return state;
}

function reducerFieldSweep(state,fieldId){
    
    if( state.fields[fieldId].sweeped ){
        return state;
    }

    if( state.fields[fieldId].hasMine ){
        return {
            ...state,
            gameState: GAMESTATE.DEAD,
            timeStampEnd: Date.now(),
            fields: state.fields.map( f => {
                if( f.hasMine ){
                    return {...f, sweeped:true }
                } else {
                    return f;
                }
            })
        }
    }

    return reducerCleanFieldSweep( state, fieldId );
}


function reducerCleanFieldSweep(state,fieldId){
    
    if( state.fields[fieldId].sweeped == false && state.fields[fieldId].hasMine == false ){
        let newState = {
            ...state,
            fields: state.fields.map( f => {
                if( f.id == fieldId ){
                    return {...f, sweeped: true, hasFlag: false }
                } else {
                    return f;
                }
            })
        }
        

        if( state.fields[fieldId].adjacentMines == 0 ){
            const {x,y} = getFieldCoordinates( state.sizeX, state.sizeY, fieldId );
            if( x > 0 ){
                newState = reducerCleanFieldSweep(newState, getFieldId(state.sizeX, state.sizeY, x-1, y) );
            }
            if( y > 0 ){
                newState = reducerCleanFieldSweep(newState, getFieldId(state.sizeX, state.sizeY, x, y-1) );
            }
            if( x < state.sizeX - 1){
                newState = reducerCleanFieldSweep(newState, getFieldId(state.sizeX, state.sizeY, x + 1, y) );
            }
            if( y < state.sizeY - 1){
                newState = reducerCleanFieldSweep(newState, getFieldId(state.sizeX, state.sizeY, x, y+1) );
            }
        }

        let unsweepedCount = 0;

        for( let f of newState.fields ){
            if( !f.sweeped ){
                unsweepedCount++;
            }
        }

        if( unsweepedCount == state.mineCount ){
            newState = {
                ...newState,
                gameState: GAMESTATE.CLEARED,
                timeStampEnd: Date.now(),
            }
        }

        return newState;
    }

    return state;
}