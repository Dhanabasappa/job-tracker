import {Box,Paper,Typography,Chip,Grid} from '@mui/material';
import {BarChart,Bar,LineChart,Line,PieChart,Pie,Cell,XAxis,YAxis,
    CartesianGrid,Tooltip,Legend,ResponsiveContainer } from 'recharts';
import { statusOptions } from '../../data/mockjobs';

function AnalyticsDashboard({jobs}) {
    //claculate metrics
    const totalJobs = jobs.length;
    const appliedJobs = jobs.filter(j => j.applieddate).length;
    const responseRate = appliedJobs > 0 ? ((
        jobs.filter(j => j.status === 'interviewing' || j.status === 'offer').length/appliedJobs * 100
    ).toFixed(1)) : 0;
    const avgresponseTime = appliedJobs > 0 ? 8.3 : 0;

    //stsus breakdown
    const statusdata = statusOptions.map(sts => ({
        name:sts.label,
        value:jobs.filter(j => j.status === sts.value).length,
        color:sts.color,
    })).filter(item => item.value > 0);

    //source breakdown
    const sourceData = [...new Set(jobs.map(j => j.source))].map(src => ({
        name:src,
        applications:jobs.filter(j => j.source === src).length,
        responses:jobs.filter(j => j.source === src && (j.status === 'interviewing' || j.status === 'offer')).length,
    }));

    //priority distribution
    const priorityData = [1,2,3,4,5].map(pri => ({
        priority:`${pri}★`,
        count:jobs.filter(j => j.priority === pri).length,
    }));

    //application over time 
    const timelineData = [
        {month:'Week 1',applications:5},
        {month:'Week 2',applications:8},
        {month:'Week 3',applications:6},
        {month:'Week 4',applications:4},
    ];

    //top companies by priority
    const topCompanies = jobs.sort((a,b) => b.priority - a.priority).slice(0,5)
        .map(job => ({
            company:job.company,
            priority:job.priority,
            status:job.status,
        }));
    
    return(
        <Box>
            <Typography variant='h4' sx={{mb:3,fontWeight:700}}>📊 Analytics Dashboard</Typography>
            {/**key metrics */}
            <Grid container spacing={3} sx={{mb:4}}>
                <Grid size={{xs:12,sm:6,md:3}}>
                    <Paper sx={{p:3,textAlign:'center',height:140,display:'flex',flexDirection:'column',
                        justifyContent:'center',alignItems:'center'}}>
                        <Typography variant='h3' sx={{fontWeight:700,color:'primary.main'}}>{totalJobs}</Typography>
                        <Typography color='text.secondary'>Total Jobs Tracked</Typography>
                    </Paper>
                </Grid>
                <Grid size={{xs:12,sm:6,md:3}}>
                    <Paper sx={{p:3,textAlign:'center',height:140,display:'flex',flexDirection:'column',
                        justifyContent:'center',alignItems:'center'}}>
                        <Typography variant='h3' sx={{fontWeight:700,color:'success.main'}}>{responseRate}%</Typography>
                        <Typography color='text.secondary'>Response Rate</Typography>
                    </Paper>
                </Grid>
                <Grid size={{xs:12,sm:6,md:3}}>
                    <Paper sx={{p:3,textAlign:'center',height:140,display:'flex',flexDirection:'column',
                        justifyContent:'center',alignItems:'center'}}>
                        <Typography variant='h3' sx={{fontWeight:700,color:'warning.main'}}>{avgresponseTime}</Typography>
                        <Typography color='text.secondary'>Average Response (days)</Typography>
                    </Paper>
                </Grid>
                <Grid size={{xs:12,sm:6,md:3}}>
                    <Paper sx={{p:3,textAlign:'center',height:140,display:'flex',flexDirection:'column',
                        justifyContent:'center',alignItems:'center'}}>
                        <Typography variant='h3' sx={{fontWeight:700,color:'info.main'}}>
                            {jobs.filter(j => j.status === 'offer').length}
                        </Typography>
                        <Typography color='text.secondary'>Active Offers</Typography>
                    </Paper>
                </Grid>
            </Grid>
            {/**charts row 1 */}
            <Grid container spacing={3} sx={{mb:3}}>
                {/**status breakdown - piechart */}
                <Grid size={{xs:12,md:6}}>
                    <Paper sx={{p:3}}>
                        <Typography variant='h6' sx={{mb:2,fontWeight:600}}>Application Status distribution</Typography>
                        <ResponsiveContainer width='100%' height={300}>
                            <PieChart>
                                <Pie data={statusdata} cx='50%' cy='50%' labelLine={false}
                                label={({name,value}) => `${name}: ${value}`} outerRadius={80}
                                fill='#8884d8' dataKey='value'>
                                {statusdata.map((entry,ind) => (
                                    <Cell key={`cell-${ind}`} fill={entry.color}/>
                                ))}
                                </Pie>
                                <Tooltip/>
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                {/**source performance - barchart */}
                <Grid size={{xs:12,md:6}}>
                    <Paper sx={{p:3}}>
                        <Typography variant='h6' sx={{mb:2,fontWeight:600}}>Performance by Source</Typography>
                        <ResponsiveContainer width='100%' height={300}>
                            <BarChart data={sourceData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
                                <CartesianGrid strokeDasharray='3 3'/>
                                <XAxis dataKey='name' angle={-45} textAnchor='end' height={100}/>
                                <YAxis/>
                                <Tooltip/>
                                <Legend/>
                                <Bar dataKey='applications' fill='#6366f1' name='Applications'/>
                                <Bar dataKey='responses' fill='#10b981' name='Responses'/>
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
            {/**charts row 2 */}
            <Grid container spacing={3} sx={{mb:3}}>
                {/**applications over time - line chart*/}
                <Grid size={{xs:12,md:6}}>
                    <Paper sx={{p:3}}>
                        <Typography variant='h6' sx={{mb:2,fontWeight:600}}>Application Activity Over Time</Typography>
                        <ResponsiveContainer width='100%' height={300}>
                            <LineChart data={timelineData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray='3 3'/>
                                <XAxis dataKey='month'/>
                                <YAxis/>
                                <Tooltip/>
                                <Legend/>
                                <Line type='monotone' dataKey='applications' stroke='#6366f1' strokeWidth={2} name='Applications' dot={{ fill: '#6366f1', r: 4 }}/>
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                {/**priority distribution - bar chart */}
                <Grid size={{xs:12,md:6}}>
                    <Paper sx={{p:3}}>
                        <Typography variant='h6' sx={{mb:2,fontWeight:600}}>Priority Levels</Typography>
                        <ResponsiveContainer width='100%' height={300}>
                            <BarChart data={priorityData} layout='vertical' margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                                <CartesianGrid strokeDasharray='3 3'/>
                                <XAxis type='number'/>
                                <YAxis type='category' dataKey='priority' width={70}/>
                                <Tooltip/>
                                <Bar dataKey='count' fill='#f59e0b' radius={[0, 8, 8, 0]}/>
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
            {/**top companies */}
            <Paper sx={{p:3}}>
                <Typography variant='h6' sx={{mb:2,fontWeight:600}}>🎯 Top Priority Companies</Typography>
                <Box sx={{display:'flex',flexDirection:'column',gap:2}}>
                    {topCompanies.map((job,index) => (
                        <Box key={index} sx={{display:'flex',justifyContent:'space-between',alignItems:'center',p:2,bgcolor:'background.default',borderRadius:2,}}>
                            <Box>
                                <Typography variant='subtitle1' sx={{fontWeight:600}}>{job.company}</Typography>
                                <Box sx={{display:'flex',gap:0.5,mt:0.5}}>{'⭐'.repeat(job.priority)}</Box>
                            </Box>
                            <Chip label={statusOptions.find(s => s.value === job.status)?.label}
                                sx={{bgcolor:statusOptions.find(s => s.value === job.status)?.color,color:'white',fontWeight:600,}}/>
                        </Box>
                    ))}
                </Box>
            </Paper>
            {/**insights section */}
            <Paper sx={{p:3,mt:3,bgcolor:'primary.light'}}>
                <Typography variant='h6' sx={{mb:2,fontWeight:600,color:'white'}}>💡 Insights & Recommendations</Typography>
                <Box sx={{display:'flex',flexDirection:'column',gap:1}}>
                    {responseRate > 20 && (
                        <Typography color='white'>
                            ✅ Great response rate! Your applications are getting noticed.
                        </Typography>
                    )}
                    {jobs.filter(j => j.priority === 5).length > 0 && (
                        <Typography color='white'>
                            🎯 You have {jobs.filter(j => j.priority === 5).length} high-priority jobs to focus on
                        </Typography>
                    )}
                    {jobs.filter(j => j.status === 'offer').length > 0 && (
                        <Typography color='white'>
                            🎉 You have {jobs.filter(j => j.status === 'offer').length} pending offer(s)!
                        </Typography>
                    )}
                    {sourceData.length > 0 && (
                        <Typography color='white'>
                            📊 You have {sourceData[0].name} is your most active source with {sourceData[0].applications} applications.
                        </Typography>
                    )}
                </Box>
            </Paper>
        </Box>
    );
}
export default AnalyticsDashboard;