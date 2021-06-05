import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Ingredient from '../../types/ingredient.interface';

interface ControlState {
    measurementPrimary: number;
    measurementSecondary: number;
    measuringUnit: string;
    item: string;
}

function controlReducer(prevState: ControlState, nextState: Partial<ControlState>): ControlState {
    return { ...prevState, ...nextState };
}

interface Props {
    config: Ingredient;
} 

function IngredientControl({ config }: Props): JSX.Element {

    const [controlState, controlDispatch] = React.useReducer(controlReducer, {
        measurementPrimary: parseInt(config.measurement.toString().slice(0, config.measurement.toString().indexOf('.'))) || 0,
        measurementSecondary: parseInt(config.measurement.toString().slice(config.measurement.toString().indexOf('.') + 1)) || 0,
        measuringUnit: config.measuringUnit,
        item: config.item
    });

    const handleChangeField = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fieldName = event.target.name;
        let fieldValue = (fieldName === 'measurementPrimary' || fieldName === 'measurementSecondary')
            ? +event.target.value
            : event.target.value;

        controlDispatch({ [fieldName]: fieldValue });
    }

    const handleBlur = () => {

    }

    return (
        <Grid container direction='row' wrap='nowrap' alignItems='center' spacing={2}>
            <Grid item xs='auto'>
                <TextField type='number' id='slc_measurement_primary' label='' name='measurementPrimary'
                    value={controlState.measurementPrimary} onChange={handleChangeField}/>
            </Grid>
            <Grid item xs='auto'>
                <TextField type='number' id='slc_measurement_secondary' label='' name='measurementSecondary'
                    value={controlState.measurementSecondary} onChange={handleChangeField}/>
            </Grid>
            <Grid item xs='auto'>
                <TextField type='string' id='slc_measuring_unit' label='' name='measuringUnit'
                    value={controlState.measuringUnit} onChange={handleChangeField}/>
            </Grid>
            <Grid item xs='auto'>
                <TextField type='text' id='txt_ingredient_item' label='' name='item'
                    value={controlState.item} onChange={handleChangeField}/>
            </Grid>
        </Grid>
    );
}

export default IngredientControl;