import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { FormGroup } from 'react-bootstrap';
import { CustomSelect } from './custom-select.component';
import { TextInput } from './text-input.component';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export const EditInformationComponent = ({ editableElement, selectedGroup, groups,
                                            editElement, editTeacherInitials, onChange,
                                            selectedTeacher, teachers, editHoursPerWeek,
                                            handleCheck, selectedCabinet, cabinets, type, remove }) => (
    <>
    {!remove &&
    <>
        {type !== "teaching-hour" &&
        <TextInput
            name="editableElement"
            type="text"
            max="35"
            value={editableElement.name}
            onChange={editElement}
        />
        }

        {type === "teacher" && 
        <TextInput
            name="initials"
            type="text"
            max="35"
            value={editableElement.initials}
            onChange={editTeacherInitials}
        />
        }

        {type === "teaching-hour" &&
        <>
            <CustomSelect
                label="Промяна на групата"
                name="selectedGroup"
                value={selectedGroup}
                onChange={onChange}
                elements={groups}
            />

            <CustomSelect
                label="Промяна на учител"
                name="selectedTeacher"
                value={selectedTeacher}
                onChange={onChange}
                elements={teachers}
            />

            <TextInput
                label="Час/седмица"
                name="hoursPerWeek"
                type="number"
                max="35"
                value={editableElement.hoursPerWeek}
                onChange={editHoursPerWeek}
            />

            <FormGroup>
                <FormControlLabel
                    control={
                    <Checkbox 
                        checked={editableElement.overAWeek} 
                        onChange={handleCheck} 
                        name="overAWeek" 
                        color="primary"
                    />}
                    label="През седмица"
                />
            </FormGroup>

            <CustomSelect
                label="Промяна на кабинет"
                name="selectedCabinet"
                value={selectedCabinet}
                onChange={onChange}
                elements={cabinets}
            />
        </>
        }
    </>}
    </>
);