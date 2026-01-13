import {Box,Paper,Typography,IconButton,
    Chip,Button,List,ListItem,ListItemText,Grid} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';
import { startOfMonth,endOfMonth,startOfWeek,endOfWeek,addMonths,subMonths,
    format,isSameMonth,isSameDay,isToday,addDays,parseISO} from 'date-fns';
import { statusOptions } from '../../data/mockjobs';
import { useState } from 'react';
import { color } from 'framer-motion';

function CalendarView({jobs,onJobClick}){
    const [currentMonth,setcurrentMonth] = useState(new Date());
    const [selectedDate,setselectedDate] = useState(new Date());

    //get evnet from jobs
    const getEventsforDate = (date) => {
        const events = [];
        jobs.forEach(job => {
            //application date
            if(job.appliedDate && isSameDay(parseISO(job.appliedDate),date)){
                events.push({
                    type:'application',
                    job,
                    title:`Applied : ${job.company}`,
                    color:'#3b82f6',
                });
            }
            //next action date
            if(job.nextActionDate && isSameDay(parseISO(job.nextActionDate),date)){
                events.push({
                    type:'follow-up',
                    job,
                    title:`Follow-up : ${job.company}`,
                    color:'#f59e0b',
                });
            }
            //timeline events
            if(job.timeline){
                job.timeline.forEach(event => {
                    if(isSameDay(parseISO(event.date),date)){
                        events.push({
                            type:event.type,
                            job,
                            title:`${event.event}  :${job.company}`,
                            color:event.type === 'interview' ? '#10b981' : '#6366f1',
                        });
                    }
                });
            }
        });
        return events;
    };

    //generate calendar days
    const generateCalendarDays = () => {
        const monthstart = startOfMonth(currentMonth);
        const monthend = endOfMonth(monthstart);
        const startDate = startOfWeek(monthstart);
        const endDate = endOfWeek(monthend);

        const days =[];
        let day = startDate;
        while (day <= endDate){
            days.push(day);
            day = addDays(day,1);
        }
        return days;
    };

    const calendardays = generateCalendarDays();
    const eventsforSelecteddate = getEventsforDate(selectedDate);
    //navigation
    const nextMonth = () => setcurrentMonth(addMonths(currentMonth,1));
    const prevMonth = () => setcurrentMonth(subMonths(currentMonth,1));
    const goToToday = () => {
        setcurrentMonth(new Date());
        setselectedDate(new Date());
    };

    return(
        <Grid container spacing={3}>
            {/**calendar section */}
            <Grid size={{xs:12,md:8}}>
                <Paper sx={{p:3}}>
                    {/**calendar header */}
                    <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center',mb:3}}>
                        <Typography variant='h5' sx={{fontWeight:600}}>
                            {format(currentMonth,'MMM yyyy')}
                        </Typography>
                        <Box sx={{display:'flex',gap:1}}>
                            <Button size='small' startIcon={<TodayIcon/>} onClick={goToToday} variant='outlined'>
                                Today
                            </Button>
                            <IconButton onClick={prevMonth} size='small'><ChevronLeftIcon/></IconButton>
                            <IconButton onClick={nextMonth} size='small'><ChevronRightIcon/></IconButton>
                        </Box>
                    </Box>
                    {/**weekday headers */}
                    <Grid container spacing={1} sx={{mb:1}}>
                        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day) => (
                            <Grid size={{xs:12/7}} key={day}>
                                <Typography variant='body2' sx={{fontWeight:600,textAlign:'center',color:'text.secondary'}}>{day}</Typography>
                            </Grid>
                        ))}
                    </Grid>
                    {/**calenday days */}
                    <Grid container spacing={1}>
                        {calendardays.map((day,index) => {
                            const events = getEventsforDate(day);
                            const isCurrentMonth = isSameMonth(day,currentMonth);
                            const isDayToday = isToday(day);
                            const isSelcted = isSameDay(day,selectedDate);
                            return(
                                <Grid size={{xs:12/7}} key={index}>
                                    <Paper onClick={() => setselectedDate(day)} sx={{p:2,minHeight:120,cursor:'pointer',
                                        bgcolor:isSelcted ? 'primary.light' : isDayToday ? 'action.hover' : 'background.paper',
                                        border:'1px solid',borderColor:isSelcted ? 'primary.main' : isDayToday ? 'primary.light' : 'divider',
                                        opacity:isCurrentMonth ? 1 : 0.5,'&:hover':{bgcolor:isSelcted ? 'primary.light' : 'action.hover',borderColor:'primary.main',},
                                        transition:'all 0.2s',display:'flex',flexDirection:'column',}}>
                                        {/**day number */}
                                        <Typography variant='body2' sx={{fontWeight:isDayToday ? 700 : 400,color:isSelcted ? 'primary.main' :'text.primary',mb:0.5,}}>
                                            {format(day,'d')}
                                        </Typography>
                                        {/**event dots */}
                                        <Box sx={{display:'flex',flexWrap:'wrap',gap:0.5}}>
                                            {events.slice(0,3).map((event,idx) => (
                                                <Box key={idx} sx={{width:6,height:6,borderRadius:'50%',bgcolor:event.color,}}/>
                                            ))}
                                            {events.length > 3 && (
                                                <Typography variant='caption' sx={{fontSize:'0.65rem'}}>+{events.length - 3}</Typography>
                                            )}
                                        </Box>
                                    </Paper>
                                </Grid>
                            );
                        })}
                    </Grid>
                    {/**legend */}
                    <Box sx={{display:'flex',gap:2,mt:3,flexWrap:'wrap'}}>
                        <Box sx={{display:'flex',alignItems:'center',gap:0.5}}>
                            <Box sx={{width:12,height:12,borderRadius:'50%',bgcolor:'#3b82f6'}}/>
                            <Typography variant='caption'>Application</Typography>
                        </Box>
                        <Box sx={{display:'flex',alignItems:'center',gap:0.5}}>
                            <Box sx={{width:12,height:12,borderRadius:'50%',bgcolor:'#3b82f6'}}/>
                            <Typography variant='caption'>Interview</Typography>
                        </Box>
                        <Box sx={{display:'flex',alignItems:'center',gap:0.5}}>
                            <Box sx={{width:12,height:12,borderRadius:'50%',bgcolor:'#3b82f6'}}/>
                            <Typography variant='caption'>Follow-up</Typography>
                        </Box>
                        <Box sx={{display:'flex',alignItems:'center',gap:0.5}}>
                            <Box sx={{width:12,height:12,borderRadius:'50%',bgcolor:'#3b82f6'}}/>
                            <Typography variant='caption'>Other</Typography>
                        </Box>
                    </Box>
                </Paper>
            </Grid>
            {/**events sidebar */}
            <Grid size={{xs:12,md:4}}>
                <Paper sx={{p:3,position:'sticky',top:100}}>
                    <Typography variant='h6' sx={{mb:2,fontWeight:600}}>{format(selectedDate,'MMM d,yyyy')}</Typography>
                    {eventsforSelecteddate.length === 0 ? (
                        <Box sx={{textAlign:'center',py:4,color:'text.secondary'}}>
                            <Typography variant='body2'>No events for this date</Typography>
                        </Box>
                    ) : (
                        <List sx={{p:0}}>
                            {eventsforSelecteddate.map((event,idx) => (
                                <ListItem key={idx} sx={{px:0,py:1.5,borderBottom:idx < eventsforSelecteddate.length -1 ? '1px solid' : 'none',
                                    borderColor:'divider',cursor:'pointer','&:hover':{bgcolor:'action.hover'},
                                }} onClick={() => onJobClick(event.job)}>
                                    <Box sx={{mr:2}}>
                                        <Box sx={{width:10,height:10,borderRadius:'50%',bgcolor:event.color,}}/>
                                    </Box>
                                    <ListItemText primary={event.title} secondary={event.job.title} primaryTypographyProps={{
                                        variant:'body2',fontWeight:600}} secondaryTypographyProps={{variant:'caption',}}/>
                                </ListItem>
                            ))}
                        </List>
                    )}
                    {/**quick stats for seleted date */}
                    {eventsforSelecteddate.length > 0 && (
                        <Box sx={{mt:3,pt:3,borderTop:'1px solid',borderColor:'divider'}}>
                            <Typography variant='subtitle2' sx={{mb:1,fontWeight:600}}>Summary</Typography>
                            <Box sx={{display:'flex',flexWrap:'wrap',gap:1}}>
                                <Chip label={`${eventsforSelecteddate.length} event ${eventsforSelecteddate.length !== 1 ? 's' : ''}`}
                                size='small' color='primary' variant='outlined'/>
                            {eventsforSelecteddate.filter(e => e.type === 'interview').length > 0 && (
                                <Chip label={`${eventsforSelecteddate.filter(e => e.type === 'interview').length} interview${eventsforSelecteddate.
                                    filter(e => e.type === 'interview').length !== 1 ? 's' : ''}`} size='small' sx={{bgcolor:'#10b981',color:'white'}}/>
                            )}
                            </Box>
                        </Box>
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
}
export default CalendarView;
