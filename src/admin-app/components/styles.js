import {
	createMuiTheme
} from '@material-ui/core';

export const theme = createMuiTheme( {
    typography: {
        fontSize: 12,
        lineHeight: 1.4,
        fontFamily: [
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join( ',' ),
    },
} );

const drawerWidth = 200;

export const styles = ( theme ) => ( {
    root: {
        display: 'flex',
        minHeight: '1000px',
        "& .MuiInputBase-input:focus": {
            border: 'none',
            boxShadow: 'none',
        }
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
        background: '#A9D040',
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create( [ 'width', 'margin' ], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        } ),
        boxShadow: 'none',
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${ drawerWidth }px)`,
        transition: theme.transitions.create( [ 'width', 'margin' ], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        } ),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create( 'width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        } ),
        borderRight: '0 none',
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        display: 'none',
        transition: theme.transitions.create( 'width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        } ),
        width: theme.spacing( 7 ),
        [ theme.breakpoints.up( 'sm' ) ]: {
            width: theme.spacing( 9 ),
        },
    },
    appBarSpacer: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing( 0, 1 ),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
    },
    appBarDivider: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    content: {
        flexGrow: 1,
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing( 4 ),
        paddingBottom: theme.spacing( 4 ),
    },
    paper: {
        padding: theme.spacing( 2 ),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
    button: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        height: 48,
        padding: '0 30px',
        margin: '10px',
    },
} );