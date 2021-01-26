import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import '../../scss/footer.scss';

function Copyright() {
    return (
        <Typography variant="body2" style={{ color: 'white' }} color="textSecondary">
            {'Copyright © '}
            <Link color="inherit" href="/">
                Online scheduler
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default function Footer() {
    return (
        <footer className="footer baseColor">
            <Container maxWidth="sm">
                <Copyright />
            </Container>
        </footer>
    );
}