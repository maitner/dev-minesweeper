import Field from "./FieldCell";


export default function FieldRow( {fields, gameState, handleFieldSweepClick, handleFieldFlagClick} ){

    return <div className="fieldrow" >{fields.map( f => <Field key={f.id} field={f}  gameState={gameState} handleFieldSweepClick={handleFieldSweepClick} handleFieldFlagClick={handleFieldFlagClick} /> )}</div>
}