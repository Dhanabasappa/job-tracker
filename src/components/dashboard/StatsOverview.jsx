import {Box,Card, Typography,CardContent} from '@mui/material';
import Grid from '@mui/material/Grid';
import { motion } from 'framer-motion';
import WorkIcon from '@mui/icons-material/Work';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EventIcon from '@mui/icons-material/Event';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const MotionCard = motion.create(Card);
function StatsOverview({stats}) {
    const stateCards = [
        {title:"Total Applications",value:stats.total,icon:<WorkIcon sx={{fontSize:40}}/>,color:'#6366f1',bgColor:'#eef2ff',},
        {title:"Active",value:stats.active,icon:<TrendingUpIcon sx={{fontSize:40}}/>,color:'#3b82f6',bgColor:'#dbeafe',},
        {title:"Interviews",value:stats.interviews,icon:<EventIcon sx={{fontSize:40}}/>,color:'#f59e0b',bgColor:'#fef3c7',},
        {title:"Offers",value:stats.offers,icon:<EmojiEventsIcon sx={{fontSize:40}}/>,color:'#10b981',bgColor:'#d1fae5',},
    ];

    return(
        <Box sx={{mb:4}}>
            <Grid container spacing={3}>
                {stateCards.map((state,index) => (
                    <Grid size={{xs:12,sm:6,md:3}} key={index}>
                        <MotionCard initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} 
                        transition={{duration:0.4,delay:index*0.1}} whileHover={{y:-5,boxShadow:'0 10px 20px rgba(0,0,0,0.1)'}}
                        sx={{height:'100%',position:'relative',overflow:'visible',background:'linear-gradient(135deg,white 0%,#fafafa 100%)'}}>
                        <CardContent sx={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',position:'relative'}}>
                            {/**icon background circle */}
                            <Box sx={{width:60,height:60,borderRadius:'50%',bgcolor:state.bgColor,
                            display:'flex',alignItems:'center',justifyContent:'center',color:state.color,mb:2}}>
                                {state.icon}
                            </Box>
                            {/**content */}
                            <Box>
                                <Typography variant='h3' sx={{fontWeight:700,color:state.color,mb:0.5}}>{state.value}</Typography>
                                <Typography variant='body2' color='text.secondary' sx={{fontWeight:500}}>{state.title}</Typography>
                            </Box>
                            {/**decorative circle */}
                            <Box sx={{position:'absolute',bottom:0,left:0,right:0,height:4,background:`linear-gradient(90deg,${state.color} 0%,${state.color}88 100%)`,borderRadius:'0 0 12px 12px',}}/>
                        </CardContent>
                        </MotionCard>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
export default StatsOverview;