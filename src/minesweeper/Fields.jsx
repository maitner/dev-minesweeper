
import Field from "./FieldCell"
import FieldRow from "./FieldRow";

export default function Fields( {sizeX,sizeY,fields,gameState,handleFieldSweepClick,handleFieldFlagClick} ){

    const rows = [];

    for( let y = 0; y < sizeY; y++){
        const row = [];
        for( let x = 0; x < sizeX; x++){
            const field = fields[ (y * sizeY + x) ];
            row.push( field )
        }

        rows.push( <FieldRow 
                key={"row_" + y} 
                fields={row} gameState={gameState}
                handleFieldSweepClick={handleFieldSweepClick}
                handleFieldFlagClick={handleFieldFlagClick}
            ></FieldRow> );
    }

    return <div className="fields">{ rows.map( r => r )}</div>
}