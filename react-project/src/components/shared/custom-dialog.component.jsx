import React from 'react';
import { IconButton,Dialog, 
        DialogActions, DialogContent, 
        DialogTitle, DialogContentText } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { SaveButton } from './custom-buttons/save-button.component';
import { DeleteButton } from './custom-buttons/delete-button.component';

export const CustomDialog = ({ show, onClose, title, danger, 
                            confirmFunction, text, disabled,
                            confirmButtonText, content }) => (
    <Dialog
        className="dialog"
        open={show}
        maxWidth="md"
        fullWidth={true}
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
        <DialogActions className="dialogAction">
            {!danger && <SaveButton
                text={confirmButtonText}
                disabled={disabled}
                onClick={confirmFunction}
                fullWidth={true}
            />}
            {danger && <DeleteButton
                text={confirmButtonText}
                disabled={disabled}
                onClick={confirmFunction}
                fullWidth={true}
            />}
        </DialogActions>
    </Dialog>
)