import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button } from '@material-ui/core';

export const DeleteButton = ({ fullWidth, text, onClick, disabled }) => (
    <Button
        fullWidth={fullWidth}
        className="delete"
        variant="contained"
        onClick={onClick}
        disabled={disabled}
    >
        {text} <DeleteIcon />
    </Button>
);