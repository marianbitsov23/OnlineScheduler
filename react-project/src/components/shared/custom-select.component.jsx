import React from 'react';
import { Select, InputLabel, MenuItem } from '@material-ui/core';

export const CustomSelect = ({ label, name, value, onChange, elements }) => (
    <div className="myDefaultMarginTopBottom">
        <InputLabel shrink>
            {label}
        </InputLabel>
        <Select
            name={name}
            fullWidth
            value={value}
            onChange={onChange}
        >
            {elements && elements.map((element, index) => (
                <MenuItem key={index} value={index}>
                    {element.name}
                </MenuItem>
            ))}
        </Select>
    </div>
)