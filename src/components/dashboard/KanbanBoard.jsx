import { Box, Paper, Typography, IconButton } from '@mui/material';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { ArrowLeft } from 'lucide-react';
import SortableJobCard from './SortableJobCard';
import { useState } from 'react';
import JobCard from './JobCard';

function KanbanBoard({ jobs, UpdateJobStatus, onJobClick, onDelete }) {
    const [activeJob, setActiveJob] = useState(null);
    const [selectedColumn, setSelectedColumn] = useState(null);
    
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );

    const columns = {
        wishlist: { title: 'Wishlist', color: '#94a3b8', description: 'Jobs you want to apply' },
        interviewing: { title: 'Interviewing', color: '#f59e0b', description: 'In interview process' },
        rejected: { title: 'Rejected', color: '#ef4444', description: 'Not moving forward' },
    };

    const getJobsByStatus = (status) => {
        return jobs.filter(job => job.status === status);
    };

    const handleDragStart = (event) => {
        const { active } = event;
        const job = jobs.find(j => j.id === active.id);
        setActiveJob(job);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) {
            setActiveJob(null);
            return;
        }
        const jobId = active.id;
        const newStatus = over.id;
        const job = jobs.find(j => j.id === jobId);
        if (job && job.status !== newStatus) {
            UpdateJobStatus(jobId, newStatus);
        }
        setActiveJob(null);
    };

    const handleCardClick = (status, count) => {
        if (count > 0) {
            setSelectedColumn(status);
        }
    };

    // Grid View - showing summary cards
    if (!selectedColumn) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
                    Job Application Board
                </Typography>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 3,
                    maxWidth: 1200}}>
                    {Object.entries(columns).map(([status, column]) => {
                        const count = getJobsByStatus(status).length;
                        const hasJobs = count > 0;
                        
                        return (
                            <Paper key={status} onClick={() => handleCardClick(status, count)}
                                sx={{
                                    p: 3,
                                    cursor: hasJobs ? 'pointer' : 'not-allowed',
                                    opacity: hasJobs ? 1 : 0.6,
                                    borderLeft: '4px solid',
                                    borderColor: column.color,
                                    transition: 'all 0.3s ease',
                                    '&:hover': hasJobs ? {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 4,
                                    } : {},}}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 600, color: column.color }}>
                                        {column.title}
                                    </Typography>
                                    <Box
                                        sx={{
                                            bgcolor: column.color,
                                            color: 'white',
                                            borderRadius: '50%',
                                            width: 40,
                                            height: 40,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.1rem',
                                            fontWeight: 700,
                                        }}
                                    >
                                        {count}
                                    </Box>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {column.description}
                                </Typography>
                                <Typography variant="caption" color="text.disabled">
                                    {hasJobs ? 'Click to view details' : 'No jobs in this category'}
                                </Typography>
                            </Paper>
                        );
                    })}
                </Box>
            </Box>
        );
    }

    // Detail View - showing jobs in selected column
    const currentColumn = columns[selectedColumn];
    const columnJobs = getJobsByStatus(selectedColumn);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <Box sx={{ p: 3 }}>
                {/* Header with back button */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <IconButton onClick={() => setSelectedColumn(null)} sx={{ bgcolor: 'background.paper' }}>
                        <ArrowLeft />
                    </IconButton>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h4" sx={{ fontWeight: 600, color: currentColumn.color }}>
                            {currentColumn.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {currentColumn.description} • {columnJobs.length} job{columnJobs.length !== 1 ? 's' : ''}
                        </Typography>
                    </Box>
                </Box>

                {/* Job Cards in Grid Layout */}
                <SortableContext items={columnJobs.map(job => job.id)} strategy={rectSortingStrategy}>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: 3,
                        mb: 3}}>
                        {columnJobs.length === 0 ? (
                            <Box sx={{
                                gridColumn: '1 / -1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: 300,
                                color: 'text.disabled',
                                textAlign: 'center',
                                p: 3,}}>
                                <Typography variant="body1">No jobs in this category</Typography>
                            </Box>
                        ) : (
                            columnJobs.map(job => (
                                <SortableJobCard
                                    key={job.id}
                                    job={job}
                                    onClick={onJobClick}
                                    onDelete={onDelete}/>
                            ))
                        )}
                    </Box>
                </SortableContext>

                {/* Drag overlay */}
                <DragOverlay>
                    {activeJob ? (
                        <Box sx={{ transform: 'rotate(5deg)', opacity: 0.9 }}>
                            <JobCard job={activeJob} />
                        </Box>
                    ) : null}
                </DragOverlay>
            </Box>
        </DndContext>
    );
}

export default KanbanBoard;