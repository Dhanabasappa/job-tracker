import {Box,List,ListItem,ListItemButton,ListItemIcon,ListItemText,Typography,Divider,Avatar,Button} from '@mui/material';
import { useContext } from 'react';
import { ProfileContext } from '../../context/ProfileContext';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkIcon from '@mui/icons-material/Work';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BarChartIcon from '@mui/icons-material/BarChart';
import FolderIcon from '@mui/icons-material/Folder';
import SettingsIcon from '@mui/icons-material/Settings';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

function Sidebar({selectedView,setSelectedView,onClose}) {
    const { profile } = useContext(ProfileContext);
    const menuItems = [
        {id:'dashboard',label:"Dashboard",icon:<DashboardIcon />},
        {id:'all-jobs',label:"All Jobs",icon:<WorkIcon />},
        {id:'calendar',label:"Calendar",icon:<CalendarMonthIcon />},
        {id:'analytics',label:"Analytics",icon:<BarChartIcon />},
    ];

    const secondaryItems = [
        {id:'documents',label:"Documents",icon:<FolderIcon />},
        {id:'settings',label:"Settings",icon:<SettingsIcon />},
    ];

    const handleItemClick = (itemId) => {
        setSelectedView(itemId);
        //close mobile drawer if open
        if(onClose) onClose();
    };

    return(
        <Box sx={{height:'100%',display:'flex',flexDirection:'column'}}>
            {/**logo section */}
            <Box sx={{p:3,display:'flex',alignItems:'center',gap:1.5,borderBottom:'1px solid',borderColor:'divider',}}>
                <RocketLaunchIcon sx={{fontSize:32,color:'primary.main',animation:'pulse 2s ease-in-out infinite',
                    '@keyframes pulse':{'0%,100%':{transform:'scale(1)',},'50%':{transform:'scale(1.05)',},},}}/>
                <Typography variant='h5' sx={{fontWeight:700,background:'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
                    backgroundClip:'text',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',}}>
                    JobTrackr
                </Typography>
            </Box>
            {/**main navigation */}
            <Box sx={{flexGrow:1,overflowY:'auto'}}>
                <List sx={{px:2,py:2}}>
                    {menuItems.map((item) => (
                        <ListItem key={item.id} disablePadding sx={{mb:0.5}}>
                            <ListItemButton selected={selectedView === item.id} onClick={() => handleItemClick(item.id)}
                                sx={{borderRadius:2,color:selectedView === item.id ? 'white' : 'text.primary','&.Mui-selected':{bgcolor:'primary.main',color:'white','& .MuiListItemIcon-root':{color:'white'},'&:hover':{bgcolor:'primary.dark',},},
                                '&:hover':{bgcolor:'action.hover',},}}>
                                <ListItemIcon sx={{minWidth:40,color:selectedView === item.id ? "white" : "inherit",}}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.label} primaryTypographyProps={{fontSize:'0.95rem',fontWeight:selectedView === item.id ? 600 : 400,}}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
                    {/**secondary items */}
                    {secondaryItems.map((item) => (
                        <ListItem key={item.id} disablePadding sx={{mb:0.5}}>
                            <ListItemButton selected={selectedView === item.id} onClick={() => handleItemClick(item.id)}
                                sx={{borderRadius:2,color:selectedView === item.id ? 'white' : 'text.primary','&.Mui-selected':{bgcolor:'primary.main',color:'white','& .MuiListItemIcon-root':{color:'white'},'&:hover':{bgcolor:'primary.dark'}},
                                '&:hover':{bgcolor:'action.hover',},}}>
                                <ListItemIcon sx={{minWidth:40,color:selectedView === item.id ? 'white' : 'inherit'}}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.label} primaryTypographyProps={{fontSize:'0.95rem',fontWeight:selectedView === item.id ? 600 : 400,}}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
            
            {/**profile section at bottom */}
            <Box sx={{p:3,display:'flex',flexDirection:'column',alignItems:'center',gap:2,borderTop:'1px solid',borderColor:'divider'}}>
                <Avatar sx={{width:60,height:60,bgcolor:'primary.main',fontSize:'1.2rem',fontWeight:700}}>
                    {profile?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </Avatar>
                <Box sx={{textAlign:'center'}}>
                    <Typography variant='subtitle2' sx={{fontWeight:600}}>{profile?.name || 'User'}</Typography>
                    <Typography variant='caption' color='text.secondary'>{profile?.email || 'email@example.com'}</Typography>
                </Box>
                <Button fullWidth variant='outlined' size='small' startIcon={<PersonIcon sx={{fontSize:'1rem'}}/>}
                    onClick={() => {setSelectedView('profile'); if(onClose) onClose();}}
                    sx={{textTransform:'none',}}>
                    View Profile
                </Button>
            </Box>
        </Box>
    );
}
export default Sidebar;