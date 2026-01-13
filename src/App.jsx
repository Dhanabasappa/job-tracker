import { useState, useContext } from 'react'
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import theme from './theme/theme.js';
//import JobList from './components/JobList.jsx';
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { mockJobs } from './data/mockjobs.js';
import ProfileView from './pages/ProfileView.jsx';
import Onboarding from './pages/Onboarding.jsx';
import { ThemeProvider, ThemeContext } from './context/ThemeContext.jsx';
import { RemindersProvider } from './context/RemindersContext.jsx';
import { ProfileProvider, ProfileContext } from './context/ProfileContext.jsx';

function App() {
  const [jobs,setJobs] = useState([]);  // Start with empty jobs - only user's real activity
  const [isAuthenticated,setIsAuthenticated] = useState(false);

  const addJob = (newjob) => {
    // Check if it's an API job (has job_title instead of title) or already formatted
    const formattedJob = {
      id: newjob.id || Date.now(),
      company: newjob.company || newjob.employer_name || 'Unknown',
      title: newjob.title || newjob.job_title || 'Unknown',
      location: newjob.location || `${newjob.job_city || ''}, ${newjob.job_state || ''}`.trim(),
      description: newjob.description || newjob.job_description || '',
      status: newjob.status || 'wishlist',
      priority: newjob.priority || 3,
      source: newjob.source || 'API Search',
      url: newjob.url || newjob.job_apply_link || '#',
      appliedDate: newjob.appliedDate || (newjob.status === 'applied' ? new Date().toISOString().split('T')[0] : null),
      keywords: newjob.keywords || newjob.technologies || [],
      timeline: newjob.timeline || [{date: new Date().toISOString().split('T')[0], event: 'Job saved', type: 'saved'}],
      contacts: newjob.contacts || [],
      notes: newjob.notes || '',
    };
    setJobs([...jobs, formattedJob]);
  };

  const updatejob = (jobid,updates) => {
    setJobs(jobs.map(job => job.id  === jobid ? {...job,...updates} : job));
  };

  const deletejob = (jobid) => {
    setJobs(jobs.filter(job => job.id !== jobid));
  };

  const updatejobstatus = (jobid,newstatus) => {
    const existingJob = jobs.find(j => j.id === jobid);
    
    if (existingJob) {
      // Update existing job
      setJobs(jobs.map(job => {
        if(job.id === jobid){
          return{
            ...job,status:newstatus,timeline:[...job.timeline,{date:new Date().toISOString().split('T')[0],event:`status changed to ${newstatus}`,type:'status_change'}]
          };
        }
        return job;
      }));
    } else {
      // This shouldn't happen, but just in case
      console.warn('Job not found:', jobid);
    }
  };

  return (
    <ThemeProvider>
      <ProfileProvider>
        <RemindersProvider jobs={jobs}>
          <AppContent jobs={jobs} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} 
            addJob={addJob} updatejob={updatejob} deletejob={deletejob} updatejobstatus={updatejobstatus}/>
        </RemindersProvider>
      </ProfileProvider>
    </ThemeProvider>
  );
}

// Separate component to use context hooks
function AppContent({ jobs, isAuthenticated, setIsAuthenticated, addJob, updatejob, deletejob, updatejobstatus }) {
  const { isDarkMode } = useContext(ThemeContext);
  const { isProfileComplete, loading } = useContext(ProfileContext);

  if (loading) {
    return null; // Show loading state if needed
  }

  // Create theme based on dark mode setting
  const muiTheme = createTheme({
    ...theme,
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: theme.palette.primary,
      secondary: theme.palette.secondary,
      status: theme.palette.status,
      ...(isDarkMode ? {
        background: {
          default: '#121212',
          paper: '#1e1e1e',
        },
        text: {
          primary: '#ffffff',
          secondary: '#b0b0b0',
        }
      } : {
        background: theme.palette.background,
        text: {
          primary: '#000000',
          secondary: '#666666',
        }
      })
    }
  });

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline/>
      <Router>
        <Routes>
          <Route path="/" element={<Landing onGetStarted={() => setIsAuthenticated(true)}/>}/>
          <Route path="/onboarding" element={<Onboarding/>}/>
          <Route path="/dashboard" element={isProfileComplete ? <Dashboard jobs={jobs} addJob={addJob} UpdateJob={updatejob} deleteJob={deletejob} UpdateJobStatus={updatejobstatus}/> : <Onboarding/>}/>
          <Route path="/profile" element={isProfileComplete ? <ProfileView/> : <Onboarding/>}/>
        </Routes>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
