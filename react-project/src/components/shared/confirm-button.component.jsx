import React from 'react';
import { Button } from '@material-ui/core';

export const ConfirmButton = ({disabled, loading, text}) => (
    <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        disabled={disabled}
        className="myDefaultMarginTopBottom"
    >
        {loading &&
            <span className="spinner-border spinner-border-sm"></span>
        }
        <span>{text}</span>
    </Button>
)