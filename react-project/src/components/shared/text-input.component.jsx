import React from 'react';
import { TextField } from '@material-ui/core';

export const TextInput = ({ error, name, value, 
                            helperText, label, max,
                            autoComplete, onChange, 
                            type, variant, className }) => (
    <div className="myDefaultMarginTopBottom">
        <TextField
            error={error}
            className={className}
            variant={variant}
            margin="dense"
            max={max}
            required
            fullWidth
            label={label}
            name={name}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
            helperText={helperText}
            type={type}
        />
    </div>
);