import { useState, useContext, useEffect } from "react";
import {Box,Paper,Typography,Switch,FormControlLabel,TextField,Button,Divider,
    MenuItem,Alert,List,ListItem,ListItemText,ListItemIcon,Dialog,
    DialogTitle,DialogContent,DialogActions,Grid,Snackbar} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LanguageIcon from '@mui/icons-material/Language';
import DownlaodIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import { RemindersContext } from '../../context/RemindersContext.jsx';

function SettingsView({jobs}){
    const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
    const { reminderSettings, updateReminderSettings } = useContext(RemindersContext);
    
    const [settings,setSettings] = useState({
        //appearance
        darkMode: isDarkMode,
        compactView:false,
        //notifications
        emailNotifications:true,
        followUpReminders: reminderSettings.followUpReminders,
        interviewReminders: reminderSettings.interviewReminders,
        weeklyDigest: reminderSettings.weeklyDigest,
        //application defaults
        defaultStatus:'wishlist',defaultPriority:3,defaultSource:'Linkedin',
        //privacy
        autoSave:true,analyticsEnabled:true,
    });
    const [deleteDailogOpen,setDeleteDialogOpen] = useState(false);
    const [saveSuccess,setSaveSuccess] = useState(false);

    // Sync settings when context changes
    useEffect(() => {
        setSettings(prev => ({
            ...prev,
            darkMode: isDarkMode,
            followUpReminders: reminderSettings.followUpReminders,
            interviewReminders: reminderSettings.interviewReminders,
            weeklyDigest: reminderSettings.weeklyDigest,
        }));
    }, [isDarkMode, reminderSettings]);

    const handlesettingChange = (setting) => (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setSettings({...settings,[setting]:value,});
        
        // Apply dark mode change immediately
        if(setting === 'darkMode') {
            toggleDarkMode();
        }
    };

    const handleSaveSettings = () => {
        // Dark mode already applied immediately on toggle
        
        // Save reminder settings
        updateReminderSettings({
            followUpReminders: settings.followUpReminders,
            interviewReminders: settings.interviewReminders,
            weeklyDigest: settings.weeklyDigest,
        });

        console.log('Saving settings:', settings);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const handleResetSettings = () => {
        setSettings({
        darkMode: isDarkMode,
        compactView: false,
        emailNotifications: true,
        followUpReminders: reminderSettings.followUpReminders,
        interviewReminders: reminderSettings.interviewReminders,
        weeklyDigest: reminderSettings.weeklyDigest,
        defaultStatus: 'wishlist',
        defaultPriority: 3,
        defaultSource: 'Linkedin',
        autoSave: true,
        analyticsEnabled: true,
        });
    };

    const handleExportData = () => {
        // Export jobs data as JSON
        const dataStr = JSON.stringify(jobs, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `job-tracker-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };

    const handleImportData = (event) => {
        const file = event.target.files[0];
        if(file){
            const reader = new FileReader();
            reader.onload = (e) => {
                try{
                    const importedData = JSON.parse(e.target.result);
                    console.log('Imported data:',importedData);
                    alert('Data imported successfully!')
                }catch(err){
                    alert('Error importing data,please check the file format');
                }
            };
            reader.readAsText(file);
        }
    };

    const handleDeleteAllData = () => {
        console.log('Deleting all data...');
        setDeleteDialogOpen(false);
    };

    return(
        <Box>
            <Typography variant="h6" sx={{mb:3,fontWeight:700}}>⚙️ Settings</Typography>
            {saveSuccess && (
                <Alert severity="success" sx={{ mb: 3 }}>Settings saved successfully!</Alert>
            )}
            <Grid container spacing={3}>
                {/**appearance settings */}
                <Grid size={{xs:12,md:6}}>
                    <Paper sx={{p:3,height:'100%'}}>
                        <Box sx={{display:'flex',alignItems:'center',gap:1,mb:3}}>
                            <DarkModeIcon color="primary"/>
                            <Typography variant="h6" sx={{fontWeight:600}}>Appearance</Typography>
                        </Box>
                        <Box sx={{display:'flex',flexDirection:'column',gap:2}}>
                            <FormControlLabel control={<Switch checked={settings.darkMode} 
                            onChange={handlesettingChange('darkMode')}/>} label='Dark Mode'/>
                            <Typography variant="caption" color="text.secondary" sx={{mt:-1,ml:4}}>Switch between light and dark theme</Typography>
                            <FormControlLabel disabled control={<Switch checked={settings.compactView} 
                            onChange={handlesettingChange('compactView')}/>} label='Compact view'/>
                            <Typography variant="caption" color="text.secondary" sx={{mt:-1,ml:4}}>
                                Coming soon
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
                {/**notifications settings */}
                <Grid size={{xs:12,md:6}}>
                    <Paper sx={{p:3,height:'100%'}}>
                        <Box sx={{display:'flex',alignItems:'center',gap:1,mb:3}}>
                            <NotificationsIcon color="primary"/>
                            <Typography variant="h6" sx={{fontWeight:600}}>Notifications</Typography>
                        </Box>
                        <Box sx={{display:'flex',flexDirection:'column',gap:2}}>
                            <FormControlLabel disabled control={<Switch checked={settings.emailNotifications} 
                            onChange={handlesettingChange('emailNotifications')}/>} label='Email Notifications'/>
                            <Typography variant="caption" color="text.secondary" sx={{mt:-1,ml:4}}>Coming soon</Typography>
                            <FormControlLabel control={<Switch checked={settings.followUpReminders} 
                            onChange={handlesettingChange('followUpReminders')}/>} label='Followup Remainders'/>
                            <Typography variant="caption" color="text.secondary" sx={{mt:-1,ml:4}}>Get reminders to follow up on applications after 7 days of inactivity</Typography>
                            <FormControlLabel control={<Switch checked={settings.interviewReminders} 
                            onChange={handlesettingChange('interviewReminders')}/>} label='Interview Remainders'/>
                            <Typography variant="caption" color="text.secondary" sx={{mt:-1,ml:4}}>Receive reminders 1, 3, and 7 days before scheduled interviews</Typography>
                            <FormControlLabel control={<Switch checked={settings.weeklyDigest} 
                            onChange={handlesettingChange('weeklyDigest')}/>} label='Weekly Digest'/>
                            <Typography variant="caption" color="text.secondary" sx={{mt:-1,ml:4}}>Receive a weekly summary of your job applications and activity</Typography>
                        </Box>
                    </Paper>
                </Grid>
                {/**application defaults */}
                <Grid size={{xs:12}}>
                    <Paper sx={{p:3}}>
                        <Typography variant="h6" sx={{fontWeight:600,mb:3}}>Application Defaults</Typography>
                        <Grid container spacing={2}>
                            <Grid size={{xs:12,sm:4}}>
                                <TextField select fullWidth label='Default Status' value={settings.defaultStatus}
                                onChange={handlesettingChange('defaultStatus')}>
                                    <MenuItem value='wishlist'>Wishlist</MenuItem>
                                    <MenuItem value='applied'>Applied</MenuItem>
                                    <MenuItem value='interviewing'>Interviewing</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid size={{xs:12,sm:4}}>
                                <TextField select fullWidth label='Default Priority' value={settings.defaultPriority}
                                onChange={handlesettingChange('defaultPriority')}>
                                    {[1,2,3,4,5].map((num)=> (
                                        <MenuItem key={num} value={num}>{'⭐'.repeat(num)} ({num})</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid size={{xs:12,sm:4}}>
                                <TextField select fullWidth label='Default Source' value={settings.defaultSource}
                                onChange={handlesettingChange('defaultSource')}>
                                    <MenuItem value='Linkedin'>LinkedIn</MenuItem>
                                    <MenuItem value='Indeed'>Indeed</MenuItem>
                                    <MenuItem value='Company Website'>Company Website</MenuItem>
                                    <MenuItem value='Referral'>Referral</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                {/**data management */}
                <Grid size={{ xs: 12 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Data Management</Typography>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <DownlaodIcon color="primary"/>
                                </ListItemIcon>
                                <ListItemText primary='Export Data' 
                                secondary='Download all your job tracking data as JSON'/>
                                <Button variant="outlined" onClick={handleExportData}>Export</Button>
                            </ListItem>
                            <Divider/>
                            <ListItem>
                                <ListItemIcon>
                                    <UploadIcon color="primary"/>
                                </ListItemIcon>
                                <ListItemText primary='Import Data' 
                                secondary='Import previously exported data'/>
                                <Button variant="outlined" component='label'>Import
                                    <input type="file" hidden accept=".json" onChange={handleImportData}/>
                                </Button>
                            </ListItem>
                            <Divider/>
                            <ListItem>
                                <ListItemIcon>
                                    <DeleteForeverIcon color="error"/>
                                </ListItemIcon>
                                <ListItemText primary='Delete all Data' 
                                secondary='Permanently delete all your job tracking data'/>
                                <Button variant="outlined" color='error' onClick={() => setDeleteDialogOpen(true)}>
                                    Delete All
                                </Button>
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>
                {/**privacy settngs */}
                <Grid size={{ xs: 12 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                        Privacy & Data
                        </Typography>
                        <Box sx={{display:'flex',flexDirection:'column',gap:2}}>
                            <FormControlLabel control={<Switch checked={settings.autoSave}
                            onChange={handlesettingChange('autoSave')} label='Auto-save changes'/>}/>
                            <Typography variant="caption" color="text.secondary" sx={{mt:-1,ml:4}}>
                                Automatically save changes as you make them
                            </Typography>
                            <FormControlLabel control={<Switch checked={settings.analyticsEnabled}
                            onChange={handlesettingChange('analyticsEnabled')} label='Enable Analytics'/>}/>
                            <Typography variant="caption" color="text.secondary" sx={{mt:-1,ml:4}}>
                                Allow anonymous usage analytics to improve the app
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
                {/**action butons */}
                <Grid size={{xs:12}}>
                    <Box sx={{display:'flex',gap:2,justifyContent:'flex-end'}}>
                        <Button variant="outlined" startIcon={<RestartAltIcon/>} onClick={handleResetSettings}>
                            Reset to Defaults
                        </Button>
                        <Button variant="outlined" startIcon={<SaveIcon/>} onClick={handleSaveSettings}>
                            Save Settings
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            {/**delete confirm dialog */}
            <Dialog open={deleteDailogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete All Data?</DialogTitle>
                <DialogContent>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        This action cannot be undone!
                    </Alert>
                    <Typography>
                        Are you sure you want to permanently delete all your job tracking data? This includes all jobs, documents, contacts, and notes.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteAllData} color="error" variant="contained">
                        Delete Everything
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
export default SettingsView;