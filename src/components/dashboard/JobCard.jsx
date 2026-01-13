import {Paper,Typography,Box,IconButton,Tooltip,Chip,Card,CardContent,CircularProgress,LinearProgress,Button,Dialog,DialogTitle,DialogContent,DialogActions,Alert} from '@mui/material';
import { motion } from 'framer-motion';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import CodeIcon from '@mui/icons-material/Code';
import {format} from 'date-fns';
import { useState } from 'react';

const MotionPaper = motion.create(Paper);

// Helper functions for match scoring and difficulty visualization
const getMatchColor = (score) => {
  if (!score) return 'default';
  if (score >= 80) return 'success';
  if (score >= 60) return 'warning';
  return 'error';
};

const getMatchLabel = (score) => {
  if (!score) return 'No Match Data';
  if (score >= 80) return 'Excellent Match';
  if (score >= 60) return 'Good Match';
  if (score >= 40) return 'Fair Match';
  return 'Low Match';
};

const getDifficultyColor = (score) => {
  if (!score) return '#9ca3af'; // Gray - No data
  if (score <= 3) return '#4caf50'; // Green - Easy
  if (score <= 6) return '#ff9800'; // Orange - Medium
  return '#f44336'; // Red - Hard
};

function JobCard({job,onClick,onDelete}){
    const [deleteDialogOpen,setDeleteDialogOpen] = useState(false);
    
    const handleClick = () => {
        if(onClick) onClick();
    };
    
    const handleDelete = () => {
        onDelete(job.id);
        setDeleteDialogOpen(false);
    };
    
    // Format date - support both appliedDate and posted_at formats
    const getFormattedDate = () => {
        if (job.appliedDate) {
            return format(new Date(job.appliedDate), 'MMM dd');
        } else if (job.posted_at) {
            return format(new Date(job.posted_at), 'MMM dd');
        }
        return 'Not applied';
    };

    // Render priority stars (for saved/wishlisted jobs)
    const renderPriorityStars = () => {
        const priority = job.priority || 0;
        return [...Array(5)].map((_,index) => (
            index < priority ? (
                <StarIcon key={index} sx={{fontSize:14,color:'#f59e0b'}}/>
            ) : (
                <StarIcon key={index} sx={{fontSize:14,color:'#d1d5db'}}/>
            )
        ));
    };

    // Get job display values with fallbacks for different API formats
    const jobTitle = job.title || job.job_title || 'Untitled Position';
    const jobCompany = job.company || job.employer_name || 'Company Not Listed';
    const jobLocation = job.location || `${job.job_city || 'Remote'}, ${job.job_state || ''}`;
    const jobSource = job.source || (job.posted_at ? 'Job Search API' : 'Saved');
    const formattedDate = getFormattedDate();

    return(
        <>
        <Card 
            onClick={handleClick}
            sx={{
                cursor:'pointer',
                transition:'all 0.3s ease',
                mb:2,
                border:'1px solid',
                borderColor:'divider',
                '&:hover':{
                    boxShadow:'0 8px 24px rgba(0,0,0,0.15)',
                    transform:'translateY(-4px)',
                    borderColor:'primary.main',
                }
            }}>
            <CardContent>
                {/* Header Section with Company and Match Score */}
                <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',mb:2}}>
                    <Box sx={{display:'flex',alignItems:'center',gap:1.5,flex:1}}>
                        <Box sx={{width:45,height:45,borderRadius:2,bgcolor:'primary.light',display:'flex',alignItems:'center',justifyContent:'center',color:'primary.main',flexShrink:0}}>
                            <BusinessIcon sx={{fontSize:24}}/>
                        </Box>
                        <Box sx={{flex:1,minWidth:0}}>
                            <Typography variant='h6' sx={{fontWeight:700,mb:0.5,overflow:'hidden',textOverflow:'ellipsis'}}>
                                {jobTitle}
                            </Typography>
                            <Typography variant='body2' color='textSecondary'>
                                {jobCompany}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Match Score Badge - Shows only if matchScore exists (API jobs) */}
                    {job.matchScore !== undefined && (
                        <Box sx={{textAlign:'center',ml:2}}>
                            <Box sx={{position:'relative',display:'inline-flex',alignItems:'center',justifyContent:'center'}}>
                                <CircularProgress
                                    variant="determinate"
                                    value={job.matchScore}
                                    size={60}
                                    sx={{color:getMatchColor(job.matchScore)}}
                                />
                                <Box sx={{position:'absolute',display:'flex',alignItems:'center',justifyContent:'center'}}>
                                    <Typography variant="caption" component="div" sx={{fontWeight:700}}>
                                        {job.matchScore}%
                                    </Typography>
                                </Box>
                            </Box>
                            <Typography variant="caption" color="textSecondary" sx={{display:'block',mt:1}}>
                                {getMatchLabel(job.matchScore)}
                            </Typography>
                        </Box>
                    )}

                    {/* Delete Button */}
                    {onDelete && (
                        <IconButton 
                            size='small' 
                            onClick={(e) => {
                                e.stopPropagation();
                                setDeleteDialogOpen(true);
                            }} 
                            sx={{ml:1}}
                        >
                            <Tooltip title="Delete Job">
                                <DeleteIcon fontSize='small' color='error' />
                            </Tooltip>
                        </IconButton>
                    )}
                </Box>

                {/* Location and Job Type */}
                <Box sx={{display:'flex',gap:1,mb:2,flexWrap:'wrap'}}>
                    <Chip
                        icon={<LocationOnIcon />}
                        label={jobLocation}
                        size="small"
                        variant="outlined"
                    />
                    {job.job_type && (
                        <Chip
                            label={job.job_type}
                            size="small"
                            variant="filled"
                            color={job.job_type?.includes('Remote') ? 'success' : 'default'}
                        />
                    )}
                </Box>

                {/* Salary Range - Shows for API jobs */}
                {(job.salary_min || job.salary_max) && (
                    <Box sx={{mb:2}}>
                        <Typography variant="body2" color="primary" sx={{fontWeight:600}}>
                            ${job.salary_min?.toLocaleString() || 'N/A'} - ${job.salary_max?.toLocaleString() || 'N/A'}
                        </Typography>
                    </Box>
                )}

                {/* Required Technologies - From API enrichment */}
                {job.technologies && job.technologies.length > 0 && (
                    <Box sx={{mb:2}}>
                        <Box sx={{display:'flex',alignItems:'center',gap:1,mb:1}}>
                            <CodeIcon sx={{fontSize:18}}/>
                            <Typography variant="subtitle2" sx={{fontWeight:600}}>
                                Required Technologies
                            </Typography>
                        </Box>
                        <Box sx={{display:'flex',gap:1,flexWrap:'wrap'}}>
                            {job.technologies.slice(0,5).map((tech) => (
                                <Chip
                                    key={tech}
                                    label={tech}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                />
                            ))}
                            {job.technologies.length > 5 && (
                                <Typography variant="caption" color="textSecondary" sx={{my:'auto'}}>
                                    +{job.technologies.length - 5} more
                                </Typography>
                            )}
                        </Box>
                    </Box>
                )}

                {/* Keywords/Skills - For saved/wishlisted jobs */}
                {job.keywords && job.keywords.length > 0 && (
                    <Box sx={{mb:2}}>
                        <Box sx={{display:'flex',flexWrap:'wrap',gap:0.5}}>
                            {job.keywords.slice(0,3).map((keyword,index) => (
                                <Chip key={index} label={keyword} size='small' sx={{height:20,fontSize:'0.7rem',
                            bgcolor:'primary.light',color:'primary.main',fontWeight:500,}}/>
                            ))}
                            {job.keywords.length > 3 && (
                                <Chip label={`+${job.keywords.length - 3}`} sx={{height:20,fontSize:'0.7rem',bgcolor:'grey.200',color:'text.secondary',}}/>
                            )}
                        </Box>
                    </Box>
                )}

                {/* Difficulty Level - For API jobs */}
                {job.difficultyScore !== undefined && (
                    <Box sx={{mb:2}}>
                        <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',mb:1}}>
                            <Typography variant="subtitle2" sx={{fontWeight:600}}>
                                Job Difficulty
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                {job.difficultyScore}/10
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={job.difficultyScore * 10}
                            sx={{
                                backgroundColor:'#e0e0e0',
                                '& .MuiLinearProgress-bar':{
                                    backgroundColor:getDifficultyColor(job.difficultyScore),
                                },
                            }}
                        />
                    </Box>
                )}

                {/* Seniority Level - For API jobs */}
                {job.seniority && (
                    <Box sx={{mb:2}}>
                        <Chip
                            label={`${job.seniority} Level`}
                            size="small"
                            color="info"
                            variant="outlined"
                        />
                    </Box>
                )}

                {/* Job Description Preview - For API jobs */}
                {job.job_description && (
                    <Box sx={{mb:2}}>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{
                                overflow:'hidden',
                                textOverflow:'ellipsis',
                                display:'-webkit-box',
                                WebkitLineClamp:2,
                                WebkitBoxOrient:'vertical',
                            }}
                        >
                            {job.job_description}
                        </Typography>
                    </Box>
                )}

                {/* Bottom Row: Priority Stars and Date */}
                <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center',mt:2.5,pt:1.5,borderTop:'1px solid',borderColor:'divider'}}>
                    <Tooltip title={job.priority ? `Priority: ${job.priority}/5` : 'No priority set'}>
                        <Box sx={{display:'flex',gap:0.25}}>
                            {renderPriorityStars()}
                        </Box>
                    </Tooltip>
                    <Box sx={{display:'flex',alignItems:'center',gap:0.5}}>
                        <CalendarTodayIcon sx={{fontSize:14,color:'text.secondary'}}/>
                        <Typography variant='caption' color='text.secondary' sx={{fontWeight:500}}>
                            {formattedDate}
                        </Typography>
                    </Box>
                </Box>

                {/* Action Buttons - For API jobs */}
                {job.job_apply_link && (
                    <Box sx={{display:'flex',gap:1,mt:2}}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            href={job.job_apply_link}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View Job
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                        >
                            Save
                        </Button>
                    </Box>
                )}
            </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle>Delete Job?</DialogTitle>   
            <DialogContent>
                <Alert severity="warning" sx={{mb:2}}>This action cannot be undone.</Alert>
                <Typography>Are you sure you want to delete <strong>{jobTitle} - {jobCompany}</strong>?</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
            </DialogActions>
        </Dialog>
    </>
    );
}
export default JobCard;