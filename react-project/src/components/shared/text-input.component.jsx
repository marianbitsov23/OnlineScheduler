import React from 'react';
import { TextField } from '@material-ui/core';

export const TextInput = ({ error, name, value, 
                            helperText, label, 
                            autoComplete, onChange, 
                            type, variant, className }) => (
    <TextField
        error={error}
        className={className}
        variant={variant}
        margin="normal"
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
);