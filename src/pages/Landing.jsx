import {Box,Container,Typography,Button,Grid,Card,CardContent} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {motion} from 'framer-motion';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);

function Landing({onGetStarted}) {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        onGetStarted();
        navigate('/onboarding');
    };

    const features = [
        {
            icon: <DashboardIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: 'Visual Pipeline',
            description: 'Track applications through an intuitive Kanban board interface'
        },
        {
            icon: <AutoAwesomeIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
            title: 'Smart Tracking',
            description: 'Never miss a follow-up with intelligent reminders and timeline tracking'
        },
        {
            icon: <AnalyticsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: 'Analytics Dashboard',
            description: 'Gain insights into your job search with detailed analytics and metrics'
        },

    ];

    return(
        <Box sx={{width:'100vw',minHeight:'100vh',background:'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',overflow:'hidden'}}>
            {/**navbar */}
            <Box sx={{py:3,px:4,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <Typography variant='h4' sx={{color:'white',fontWeight:700,display:'flex',alignItems:'center',gap:1}}>
                    <RocketLaunchIcon/> JobTrackr
                </Typography>
                <Button variant='outlined' sx={{color:'white',borderColor:'white','&:hover':{borderColor:'white',bgcolor:'rgba(255,255,255,0.1)'}}}
                    onClick={handleGetStarted}>
                    Get Started
                </Button>
            </Box>
            {/**hero section */}
            <Container maxWidth="lg" sx={{width:'100%'}}>
                <MotionBox initial={{opacity:0,y:50}} animate={{opacity:1,y:0}} 
                    transition={{duration:0.8}} sx={{textAlign:'center',color:'white',py:{xs:8,md:12}}}>
                    <Typography variant='h1' sx={{fontWeight:800,mb:3,fontSize:{xs:'2.5rem',md:'3.5rem'},background:'linear-gradient(to right,#fff,#e0e7ff)',
                        backgroundClip:'text',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                        Track Every Application<br/> Land Your Dream Job
                    </Typography>
                    <Typography 
                        variant="h5" sx={{mb: 5,opacity: 0.9,maxWidth: '700px',mx: 'auto',lineHeight: 1.6}}>
                        Stay organized and never miss an opportunity with our intelligent job application tracker
                    </Typography>
                    <MotionBox whileHover={{scale:1.05}} whileTap={{scale:0.95}}>
                        <Button variant="contained" size="large" onClick={handleGetStarted} 
                            sx={{px:6,py:2,fontSize:'1.1rem',bgcolor:'white',color:'primary.main',boxShadow:'0 10px 30px rgba(0,0,0,0.2)',
                                '&:hover':{bgcolor:'grey.100',boxShadow:'0 15px 40px rgba(0,0,0,0.3)',}
                            }} endIcon = {<RocketLaunchIcon/>}>
                            Get Started Free
                        </Button>
                    </MotionBox>
                    <Typography variant='body2' sx={{mt:2,opacity:0.8}}>
                        No credit card required. 
                    </Typography>
                </MotionBox>
                {/**features section */}
                <Box sx={{pb:12}}>
                    <Grid container spacing={4}>
                        {features.map((feature,index) => (
                            <Grid size={{ xs: 12, md: 4 }} key={index}>
                                <MotionCard initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.2 }}
                                    whileHover={{y: -10,boxShadow: '0 20px 40px rgba(0,0,0,0.2)'}}
                                    sx={{height:'100%',background:'rgba(255,255,255,0.95)',backdropFilter:'blur(10px)',borderRadius:3}}>
                                    <CardContent sx={{textAlign:'center',py:4}}>
                                        <Box sx={{mb:2}}>{feature.icon}</Box>
                                        <Typography variant='h5' sx={{fontWeight:600,mb:2}}>{feature.title}</Typography>
                                        <Typography variant='body1' color='text.secondary'>{feature.description}</Typography>
                                    </CardContent>
                                </MotionCard>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                {/**how it works section */}
                <Box sx={{py:8,textAlign:'center'}}>
                    <Typography variant='h3' sx={{mb:6,color:'white',fontWeight:700}}>How It Works</Typography>
                    <Grid container spacing={3} sx={{mb:8}}>
                        {[
                            {num:1,title:"Add Jobs",desc:"Manually enter or paste job URLs"},
                            {num:2,title:"Track Progress",desc:"Update status and next actions"},
                            {num:3,title:"Stay Organized",desc:"Add notes, contacts, and documents"},
                            {num:4,title:"Get Insights",desc:"Analyze your job search strategy"},
                        ].map((step,i) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                                <MotionBox initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} 
                                    transition={{duration:0.5,delay:0.8 + (i*0.1)}}>
                                    <Box sx={{width:80,height:80,borderRadius:'50%',bgcolor:'white',color:'primary.main',display:'flex',
                                        alignItems:'center',justifyContent:'center',fontSize:'2rem',fontWeight:700,mx:'auto',mb:2,boxShadow:'0 10px 30px rgba(0,0,0,0.2)'}}>
                                        {step.num}
                                    </Box>
                                    <Typography variant='h6' sx={{color:'white',mb:1,fontWeight:600}}>{step.title}</Typography>
                                    <Typography sx={{color:'rgba(255,255,255,0.8)'}}>{step.desc}</Typography>
                                </MotionBox>
                            </Grid>
                        ))}
                    </Grid>
                    {/** call to action */}
                    <MotionBox whileHover={{scale:1.05}} whileTap={{scale:0.95}}>
                        <Button variant='contained' size='large' onClick={handleGetStarted}
                            sx={{px:6,py:2,fontSize:'1.1rem',bgcolor:'white',color:'primary.main',boxShadow:'0 10px 30px rgba(0,0,0,0.2)','&:hover':{bgcolor:'grey.100'}}}>
                            Start Tracking Today
                        </Button>
                    </MotionBox>
                </Box>
            </Container>
        </Box>
    );
}
export default Landing;