import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';

function Copyright() {
    return (
        <Typography variant="body2" className="myWhiteColor" color="textSecondary">
            {'Copyright © '}
            <Link color="inherit" href="/" className="myWhiteColor">
                OnlineScheduler
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default function Footer() {
    return (
        <footer className="footer primaryBackground">
            <Container maxWidth="lg">
                <Copyright />
            </Container>
        </footer>
    );
}