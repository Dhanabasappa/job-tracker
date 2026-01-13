import { Drawer,Box,Typography,IconButton,Chip,TextField,Button,Divider,MenuItem,Paper,List,
    ListItem,Dialog,DialogTitle,DialogContent,DialogActions,Alert
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkIcon from '@mui/icons-material/Link';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { format } from "date-fns";
import { statusOptions } from "../../data/mockjobs";
import { useState } from "react";

function JobDetailPanel({open,job,onClose,onUpdate,onDelete}){
    const [isEditing,setIsEditing] = useState(false);
    const [editedJob,setEditedJob] = useState(job || {});
    const [notes,setNotes] = useState(job?.notes || '');
    const [deletedialogOpen,setDeleteDialogOpen] = useState(false);

    // Helper to get field value from either API job or regular job format
    const getField = (apiField, regularField) => {
        if (!job) return '';
        return job[apiField] || job[regularField] || '';
    };

    //update local state when job prop chnages
    if(job && job.id !== editedJob.id){
        setEditedJob(job);
        setNotes(job.notes || '');
    }
    if(!job) return null;

    //handle filed changes during edit
    const handleEditChange = (field) => (event) => {
        setEditedJob({...editedJob,[field]: event.target.value,});
    };

    //delete job
    const handleDelete = () => {
        onDelete(job.id);
        setDeleteDialogOpen(false);
        onClose();
    };

    //priority stars
    const priorityStars = (p) => {
        return [...Array(5)].map((_,i) => (
            i < p ? (
                <StarIcon key={i} sx={{fontSize:18,color:'#f59e0b'}}/>
            ) : (<StarBorderIcon key={i} sx={{fontSize:18,color:'#d1d5db'}}/>)
        ));
    };

    //get status color
    const getstatusColor = (status) => {
        const statusObj = statusOptions.find(s => s.value === status);
        return statusObj ? statusObj.color : '#94a3b8';
    };

    return(
        <>
            <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{sx:{width:{xs:'100%',sm:500},p:0,pl:3}}}>
                <Box sx={{height:'100%',display:'flex',flexDirection:'column'}}>
                    {/**top bar - Job Details title and buttons */}
                    <Box sx={{p:2,pl:0,pr:3,borderBottom:'1px solid',borderColor:'divider',display:'flex',justifyContent:'space-between',alignItems:'center',bgcolor:'background.default'}}>
                        <Typography variant="h6" sx={{fontWeight:600}}>Job Details</Typography>
                        <Box>
                            <IconButton onClick={onClose} size="small"><CloseIcon/></IconButton>
                        </Box>
                    </Box>
                    
                    {/**fixed company/title section with logo and website */}
                    <Box sx={{p:3,pl:0,pr:3,pb:2,borderBottom:'1px solid',borderColor:'divider',bgcolor:'background.paper'}}>
                        {/**company logo, title and website */}
                        <Box sx={{display:'flex',alignItems:'flex-start',gap:2,mb:2}}>
                            {job.employer_logo ? (
                                <Box component="img" src={job.employer_logo} alt="Company" sx={{width:56,height:56,borderRadius:2,objectFit:'contain',bgcolor:'#f3f4f6',p:1}}/>
                            ) : (
                                <Box sx={{width:56,height:56,borderRadius:2,bgcolor:'primary.light',display:'flex',alignItems:'center',justifyContent:'center',color:'primary.main',flexShrink:0}}>
                                    <BusinessIcon sx={{fontSize:28}}/>
                                </Box>
                            )}
                            <Box sx={{flex:1,minWidth:0}}>
                                {isEditing ? (
                                    <TextField fullWidth value={editedJob.company || editedJob.employer_name || ''} onChange={handleEditChange('company')} size="small" sx={{mb:1}}/>
                                ) : (
                                    <Typography variant="h5" sx={{fontWeight:700,wordBreak:'break-word'}}>{getField('employer_name', 'company')}</Typography>
                                )}
                                {isEditing ? (
                                    <TextField fullWidth value={editedJob.title || editedJob.job_title || ''} onChange={handleEditChange('title')} size="small" sx={{mb:1}}/>
                                ) : (
                                    <Typography variant="body1" color="text.secondary" sx={{wordBreak:'break-word'}}>{getField('job_title', 'title')}</Typography>
                                )}
                                {job.employer_website && (
                                    <Button size="small" href={job.employer_website} target="_blank" endIcon={<LinkIcon/>} sx={{mt:0.5,p:0,textTransform:'none'}}>
                                        Visit Website
                                    </Button>
                                )}
                            </Box>
                        </Box>
                        {/**status chip */}
                        <Chip label={statusOptions.find(s => s.value === job.status)?.label || job.status}
                            sx={{bgcolor:getstatusColor(job.status),color:'white',fontWeight:600}}/>
                    </Box>
                    
                    {/**fixed overview section - does not scroll */}
                    <Box sx={{p:3,pl:0,pr:3,pb:2,borderBottom:'1px solid',borderColor:'divider',bgcolor:'background.paper'}}>
                        <Typography variant="subtitle1" sx={{fontWeight:600,mb:2}}>📋 Overview</Typography>
                        <Box sx={{display:'flex',flexDirection:'column',gap:2}}>
                            {/**location */}
                            {(getField('job_city', 'location') || getField('job_state', '')) && (
                                <Box sx={{display:'flex',alignItems:'center',gap:1}}>
                                    <LocationOnIcon sx={{color:'text.secondary',fontSize:20}}/>
                                    {isEditing ? (
                                        <TextField fullWidth value={editedJob.location || editedJob.job_city || ''} onChange={handleEditChange('location')} size="small"/>
                                    ) : (
                                        <Typography>{getField('job_city', 'location')}{getField('job_state', '') ? `, ${getField('job_state', '')}` : ''}</Typography>
                                    )}
                                </Box>
                            )}
                            {/**job type */}
                            {getField('job_type', '') && (
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{mb:0.5}}>Job Type</Typography>  
                                    <Typography>{getField('job_type', '')}</Typography>
                                </Box>
                            )}
                            {/**source */}
                            {getField('source', '') && (
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{mb:0.5}}>Source</Typography>  
                                    <Typography>{getField('source', '')}</Typography>
                                </Box>
                            )}
                            {/**applied date */}
                            {(job.appliedDate || job.applied_date) && (
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{mb:0.5}}>Applied Date</Typography>
                                    <Typography>{format(new Date(job.appliedDate || job.applied_date),'MMM dd, yyyy')}</Typography>
                                </Box>
                            )}
                            {/**priority */}
                            {(job.priority !== undefined && job.priority !== null) && (
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{mb:0.5}}>Priority</Typography>
                                    <Box sx={{display:'flex',gap:0.5}}>
                                        {priorityStars(job.priority || 0)}
                                    </Box>
                                </Box>
                            )}
                            {/**salary info */}
                            {(getField('salary_max', 'salary_max') || getField('salary_min', 'salary_min')) && (
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{mb:0.5}}>Salary Range</Typography>
                                    <Typography variant="body2" sx={{fontWeight:600,color:'primary.main'}}>
                                        ${getField('salary_min', 'salary_min') ? parseFloat(getField('salary_min', 'salary_min')).toLocaleString() : 'N/A'} - ${getField('salary_max', 'salary_max') ? parseFloat(getField('salary_max', 'salary_max')).toLocaleString() : 'N/A'}
                                    </Typography>
                                </Box>
                            )}
                            {/**job url */}
                            {(job.url || job.job_url) && (
                                <Box>
                                    <Button startIcon={<LinkIcon/>} href={job.url || job.job_url} target="_blank" variant="outlined" size="small" fullWidth>
                                        View Original Posting
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Box>
                    
                    {/**fixed keywords section - does not scroll */}
                    {(job.keywords || job.technologies) && (job.keywords || job.technologies).length > 0 && (
                        <Box sx={{p:3,pl:0,pr:3,pb:2,borderBottom:'1px solid',borderColor:'divider',bgcolor:'background.paper'}}>
                            <Typography variant="subtitle1" sx={{fontWeight:600,mb:2}}>🏷️ Skills Required</Typography>
                            <Box sx={{display:'flex',flexWrap:'wrap',gap:1}}>
                                {(job.keywords || job.technologies).map((keyword,index) => (
                                    <Chip key={index} label={keyword} size="small" color="primary" variant="outlined"/>) 
                                )}
                            </Box>
                        </Box>
                    )}
                    
                    {/**Experience Required section */}
                    {(job.job_required_experience?.required_experience_in_months || job.experience) && (
                        <Box sx={{p:3,pl:0,pr:3,pb:2,borderBottom:'1px solid',borderColor:'divider',bgcolor:'background.paper'}}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                            📊 Experience Required
                            </Typography>
                            <Typography variant="body2">
                                {job.job_required_experience?.required_experience_in_months ? 
                                    `${(job.job_required_experience.required_experience_in_months / 12).toFixed(1)} years` :
                                    job.experience || 'N/A'
                                }
                            </Typography>
                        </Box>
                    )}

                    {/**Benefits section */}
                    {job.job_highlights?.Benefits && job.job_highlights.Benefits.length > 0 && (
                        <Box sx={{p:3,pl:0,pr:3,pb:2,borderBottom:'1px solid',borderColor:'divider',bgcolor:'background.paper'}}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                            🎁 Benefits
                            </Typography>
                            <List sx={{p:0}}>
                                {job.job_highlights.Benefits.map((benefit,index) => (
                                    <ListItem key={index} sx={{py:0.5,px:0,display:'list-item'}}>
                                        <Typography variant="body2">• {benefit}</Typography>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}

                    {/**Responsibilities section */}
                    {job.job_highlights?.Responsibilities && job.job_highlights.Responsibilities.length > 0 && (
                        <Box sx={{p:3,pl:0,pr:3,pb:2,borderBottom:'1px solid',borderColor:'divider',bgcolor:'background.paper'}}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                            ✅ Responsibilities
                            </Typography>
                            <List sx={{p:0}}>
                                {job.job_highlights.Responsibilities.map((resp,index) => (
                                    <ListItem key={index} sx={{py:0.5,px:0,display:'list-item'}}>
                                        <Typography variant="body2">• {resp}</Typography>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}
                    
                    {/**Job Description section */}
                    {(job.job_description || job.description) && (
                        <Box sx={{p:3,pl:0,pr:3,pb:2,borderBottom:'1px solid',borderColor:'divider',bgcolor:'background.paper'}}>
                            <Typography variant="subtitle1" sx={{fontWeight:600,mb:2}}>📄 Job Description</Typography>
                            <Box sx={{
                                typography: 'body2',
                                '& p': { mb: 1.2 },
                                '& ul': { pl: 2 },
                                '& li': { mb: 0.5 },}}
                            dangerouslySetInnerHTML={{
                                __html: getField('job_description', 'description'),}}/>

                        </Box>
                    )}

                    {/**empty scrollable area */}
                    <Box sx={{flex:1,overflowY:'auto',pr:3,pb:3,pt:3}}>
                    </Box>
                </Box>
            </Drawer>
            {/**delete confirmation dialog */}
            <Dialog open={deletedialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Job?</DialogTitle>   
                <DialogContent>
                    <Alert severity="warning">This action cannot be undone.</Alert>
                    <Typography>Are you sure you want to delete <strong>{getField('employer_name', 'company')} - {getField('job_title', 'title')}</strong>?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
export default JobDetailPanel;