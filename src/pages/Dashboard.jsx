import { useState, useContext } from 'react';
import {Box,Drawer,Typography} from '@mui/material';
import Sidebar from '../components/layout/Sidebar';
import KanbanBoard from '../components/dashboard/KanbanBoard';
import StatsOverview from '../components/dashboard/StatsOverview';
import RemindersPanel from '../components/dashboard/RemindersPanel';
import JobDetailPanel from '../components/job/JobDetailPanel';
import SearchFilter from '../components/dashboard/SearchFilter';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';
import CalendarView from '../components/dashboard/CalenderView';
import DocumentsView from '../components/dashboard/DocumentsView';
import SettingsView from '../components/dashboard/SettingsView';
import AllJobsView from '../components/dashboard/AllJobsView';
import ProfileView from './ProfileView';
import { ProfileContext } from '../context/ProfileContext';

const DRAWER_WIDTH = 260;
function Dashboard({jobs,addJob,UpdateJob,deleteJob,UpdateJobStatus}){
    const { profile, markFirstTimeComplete } = useContext(ProfileContext);
    const [mobileOpen,setMobileOpen] = useState(false);
    const [selectedView,setSelectedView] = useState("all-jobs");
    const [selectedJob,setSelectedJob] = useState(null);
    //search and filter state
    const [searchQuery,setSearchQuery] = useState('');
    const [statusFilter,setStatusFilter] = useState('all');
    const [sourceFilter,setSourceFilter] = useState('all');
    const [priorityFilter,setPriorityFilter] = useState('all');
    const [view,setView] = useState('kanban');

    // Check if user just completed onboarding
    const isFirstTimeUser = profile?.isFirstTimeUser === true;

    // Wrapper around addJob to mark first time complete
    const handleAddJob = (job) => {
      addJob(job);
      if (isFirstTimeUser) {
        markFirstTimeComplete();
      }
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    //filter&search logic
    const filteredJobs = jobs.filter(job => {
        //search filter
        const searchLower = searchQuery.toLowerCase();
        const matchessearch = job.company.toLowerCase().includes(searchLower) ||
        job.title.toLowerCase().includes(searchLower) ||
        (job.keywords && job.keywords.some(k => k.toLowerCase().includes(searchLower)));
        //status filter
        const matchesstatus = statusFilter === 'all' || job.status === statusFilter;
        //source filter
        const matchessource = sourceFilter === 'all' || job.source === sourceFilter;
        //priority filter
        const matchespriority = priorityFilter === 'all' || job.priority >= parseInt(priorityFilter);

        return matchessearch && matchesstatus && matchessource && matchespriority;
    });

    //clear all filters
    const handleClearallFilters = () => {
        setStatusFilter('all');
        setSourceFilter('all');
        setPriorityFilter('all');
    };

    //calculate stats - only based on user's tracked jobs, not API/mock jobs
    const stats = {
        total: jobs.length,
        active: jobs.filter(j => j.status === "applied" || j.status === "interviewing").length,
        interviews: jobs.filter(j => j.status === "interviewing").length,
        offers: jobs.filter(j => j.status === "offer").length,
    };

    return(
        <Box sx={{display:'flex',minHeight:'100vh',bgcolor:'background.default'}}>
            {/**sidebar drawer */}
            <Box component='nav' sx={{width:{sm:DRAWER_WIDTH},flexShrink:{sm:0}}}>
                <Drawer variant='temporary' open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{keepMounted:true,}}
                    sx={{display:{xs:'block',sm:'none'},'&.MuiDrawer-paper':{boxSizing:'border-box',width:DRAWER_WIDTH,bgcolor:'background.paper',
                        borderRight:'1px solid',borderColor:'divider',},}}>
                    <Sidebar selectedView={selectedView} setSelectedView={setSelectedView} onClose={handleDrawerToggle}/>
                </Drawer>
                {/**desktop drawer */}
                <Drawer variant='permanent' sx={{display:{xs:'none',sm:'block'},'&.MuiDrawer-paper':{boxSizing:'border-box',width:DRAWER_WIDTH,
                    bgcolor:'background.paper',borderRight:'1px solid',borderColor:'divider',},}} open>
                    <Sidebar selectedView={selectedView} setSelectedView={setSelectedView}/>
                </Drawer>
            </Box>

            {/**main content area */}
            <Box component='main' sx={{flexGrow:1,p:3,width:{sm:`calc(100% - ${DRAWER_WIDTH}px)`},display:'flex',flexDirection:'column'}}>
                {/**stats overview - only show if user has actual activity */}
                {(selectedView === 'dashboard' && jobs.length > 0) && <StatsOverview stats={stats}/>}
                {/**reminders panel - only on dashboard view */}
                {(selectedView === 'dashboard') && <RemindersPanel/>}
                {/**conditional rendering */}
                {selectedView === 'profile' ? (
                    //Profile view
                    <ProfileView/>
                ) : selectedView === 'analytics' ? (
                    //Analytics dashboard
                    <AnalyticsDashboard jobs={jobs}/>
                ) : selectedView === 'calendar' ? (
                    <CalendarView jobs={jobs} onJobClick={(job) => setSelectedJob(job)}/>
                ) : selectedView === 'documents' ? (
                    <DocumentsView  jobs={jobs} onUpdateJob={UpdateJob}/>
                ) : selectedView === 'settings' ? (
                    <SettingsView jobs={jobs}/>
                ) : selectedView === 'all-jobs' ? (
                    <>
                        {/**all jobs view with action buttons */}
                        <AllJobsView jobs={jobs} onJobClick={(job) => setSelectedJob(job)} 
                            onUpdateJob={UpdateJob} onDeleteJob={deleteJob} onUpdateStatus={UpdateJobStatus}
                            onAddJob={handleAddJob} isFirstTime={isFirstTimeUser}/>
                    </>
                ) : selectedView === 'dashboard' ? (
                    <>
                        {/**search & filter bar */}
                        <SearchFilter searchQuery={searchQuery} onSearchChange={setSearchQuery}
                            statusFilter={statusFilter} onStatusFilterChange={setStatusFilter}
                            sourceFilter={sourceFilter} onSourceFilterChange={setSourceFilter}
                            priorityFilter={priorityFilter} onPriorityFilterChange={setPriorityFilter} 
                            onClearFilters={handleClearallFilters} view={view} onViewChnage={setView} resultsCount={filteredJobs.length}/>
                        {/**kanban board - only show if user has added jobs */}
                        {jobs.length > 0 ? (
                          <KanbanBoard jobs={jobs} UpdateJobStatus={UpdateJobStatus} onJobClick={(job) => setSelectedJob(job)} onDelete={deleteJob}/>
                        ) : (
                          <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography color="textSecondary">No jobs added yet. Go to All Jobs to find and apply for opportunities!</Typography>
                          </Box>
                        )}
                    </>
                ) : (
                    <></>
                )}
                {/**job detail panel */}
                <JobDetailPanel open={!!selectedJob} job={selectedJob} onClose={() => setSelectedJob(null)} 
                onUpdate={UpdateJob} onDelete={deleteJob}/>
            </Box>
        </Box>
    );
}
export default Dashboard;