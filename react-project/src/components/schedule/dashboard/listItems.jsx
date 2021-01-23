import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import PeopleIcon from '@material-ui/icons/People';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import TableChartIcon from '@material-ui/icons/TableChart';
import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode';
import GroupWorkIcon from '@material-ui/icons/GroupWork';

export const mainListItems = (
    <div>
        <ListItem button>
            <ListItemIcon>
                <LibraryBooksIcon />
            </ListItemIcon>
            <ListItemText primary="Subjects" />
        </ListItem>
        <ListItem button>
            <ListItemIcon>
                <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Teachers" />
        </ListItem>
        <ListItem button>
            <ListItemIcon>
                <MeetingRoomIcon />
            </ListItemIcon>
            <ListItemText primary="Cabinets" />
        </ListItem>
        <ListItem button>
            <ListItemIcon>
                <TableChartIcon />
            </ListItemIcon>
            <ListItemText primary="Time Tables" />
        </ListItem>
        <ListItem button>
            <ListItemIcon>
                <GroupWorkIcon />
            </ListItemIcon>
            <ListItemText primary="Groups" />
        </ListItem>
        <ListItem button>
            <ListItemIcon>
                <ChromeReaderModeIcon />
            </ListItemIcon>
            <ListItemText primary="Teaching Hours" />
        </ListItem>
    </div>
);

export const secondaryListItems = (
    <div>
      <ListSubheader inset>Previous schedules</ListSubheader>
      <ListItem button>
            <ListItemIcon>
                <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Schedule 1" />
      </ListItem>
      <ListItem button>
            <ListItemIcon>
                <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Schedule 2" />
      </ListItem>
        <ListItem button>
            <ListItemIcon>
                <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Schedule 3" />
        </ListItem>
    </div>
  );