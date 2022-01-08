import React from 'react';
import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';

// project imports
import Breadcrumbs from '../../ui-component/extended/Breadcrumbs';
import Header from './Header';
import Sidebar from './Sidebar';

import navigation from '../../menu-items';
import { drawerWidth } from '../../store/constant';


// import { SET_MENU } from '../../store/actions';

// assets
import { IconChevronRight } from '@tabler/icons';

// styles
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    ...theme.typography.mainContent,
    ...(!open && {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        [theme.breakpoints.up('md')]: {            
            width: `calc(100% - ${drawerWidth}px)`
        },
        [theme.breakpoints.down('md')]: {           
            width: `calc(100% - ${drawerWidth}px)`,
            padding: '16px'
        },
        [theme.breakpoints.down('sm')]: {         
            width: `calc(100% - ${drawerWidth}px)`,
            padding: '16px',
        },
        margin: '20px',
    }),
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        width: `calc(100% - ${drawerWidth}px)`,
        margin: '20px',
        // [theme.breakpoints.down('md')]: {
        //     marginLeft: '20px'
        // },
        // [theme.breakpoints.down('sm')]: {
        //     marginLeft: '10px'
        // }
    })
}));

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
    const theme = useTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down('lg'));

    // Handle left drawer
    const leftDrawerOpened = true//useSelector((state) => state.customization.opened);
    // const dispatch = useDispatch();
    const handleLeftDrawerToggle = () => {
        //dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
    };

    // useEffect(() => {
    //     dispatch({ type: SET_MENU, opened: !matchDownMd });
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [matchDownMd]);

    return (
        <Box sx={{ }}>
            <CssBaseline />
            {/* header */}
            <AppBar
                enableColorOnDark
                position="relative"
                color="inherit"
                elevation={0}
                sx={{
                    bgcolor: theme.palette.background.default,
                    transition: leftDrawerOpened ? theme.transitions.create('width') : 'none'
                }}
            >
                <Toolbar>
                    <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
                </Toolbar>
            </AppBar>

            <Box sx={{ display: 'flex' }}>
                {/* drawer */}
                <Sidebar drawerOpen={leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />

                {/* main content */}
                <Main theme={theme} open={leftDrawerOpened}>
                    {/* breadcrumb */}
                    main
                    <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />
                    <Outlet />
                </Main>
            </Box>
        </Box>
    );
};

export default MainLayout;
