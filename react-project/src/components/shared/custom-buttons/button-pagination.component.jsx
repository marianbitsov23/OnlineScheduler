import React from 'react';
import { NextButton } from './next-button.component';

export const ButtonPagination = ({ backwardLink, forwardLink }) => (
    <div className="myDisplayFlex justifyContentSpaceBetween">
        <NextButton type="backwards" link={backwardLink}/>
        <NextButton type="forward" link={forwardLink}/>
    </div>
);