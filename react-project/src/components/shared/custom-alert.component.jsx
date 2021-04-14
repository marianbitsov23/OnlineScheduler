import React from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import { Snackbar } from '@material-ui/core';

const Alert = (props) => (<MuiAlert elevation={6} variant="filled" {...props} />);

export const CustomAlert = ({ open, onClose, variant, alertText }) => (
    <Snackbar 
        anchorOrigin={{vertical: 'top', horizontal: 'right'}} 
        open={open} 
        autoHideDuration={4000} 
        onClose={onClose}
    >
        <Alert onClose={onClose} severity={variant}>
            {alertText}
        </Alert>
    </Snackbar>
)