import React from 'react';
import { TextField } from '@material-ui/core';

export const TextInput = ({ error, name, value, placeholder,
                            helperText, label, max, readOnly,
                            autoComplete, onChange, type,
                            variant, className, shrink }) => (
    <div >
        <TextField
            error={error}
            className={className}
            variant={variant}
            margin="normal"
            max={max}
            placeholder={placeholder}
            required
            fullWidth
            label={label}
            name={name}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
            helperText={helperText}
            type={type}
            InputLabelProps={{ shrink: shrink }}
            InputProps={{ readOnly: readOnly }}
        />
    </div>
);