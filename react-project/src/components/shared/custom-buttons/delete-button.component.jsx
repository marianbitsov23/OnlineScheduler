import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button } from '@material-ui/core';

export const DeleteButton = ({ text, onClick }) => (
    <Button
        className="delete"
        variant="contained"
        onClick={onClick}
    >
        {text} <DeleteIcon />
    </Button>
);