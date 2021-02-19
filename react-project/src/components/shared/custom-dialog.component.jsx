import React from 'react';
import { Button, IconButton,
        Dialog, DialogActions, DialogContent, 
        DialogTitle, DialogContentText } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

export const CustomDialog = ({ show, onClose, title, 
                            confirmFunction, text, 
                            confirmButtonText, content }) => (
    <Dialog
        className="dialog"
        open={show}
        onClose={onClose}
    >
        <DialogTitle>
            <div className="dialogTitle">
                <div className="titleText">
                    {title}
                </div>
                <div>    
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </div>
            </div>
        </DialogTitle>
        <DialogContent>
            <DialogContentText>
                {text}
            </DialogContentText>
            {content}
        </DialogContent>
        <DialogActions>
            <Button onClick={confirmFunction} color="secondary" variant="contained">
                {confirmButtonText}
            </Button>
        </DialogActions>
    </Dialog>
)