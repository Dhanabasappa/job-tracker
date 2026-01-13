import { Box, Paper, Typography, IconButton } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {  Trash2 } from 'lucide-react';

// Sortable Job Card Component for Grid Layout
function SortableJobCard({ job, onClick, onDelete }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: job.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <Paper
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            sx={{
                p: 2.5,
                cursor: 'grab',
                position: 'relative',
                '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-2px)',
                },
                '&:active': {
                    cursor: 'grabbing',
                },
                transition: 'all 0.2s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', flex: 1 }}>
                    {job.title || 'Untitled Job'}
                </Typography>
                {onDelete && (
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(job.id);
                        }}
                        sx={{ ml: 1 }}
                    >
                        <Trash2 size={16} />
                    </IconButton>
                )}
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {job.company || 'Unknown Company'}
            </Typography>
            {job.location && (
                <Typography variant="caption" color="text.disabled">
                    📍 {job.location}
                </Typography>
            )}
            {job.salary && (
                <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
                    💰 {job.salary}
                </Typography>
            )}
            <Box
                onClick={(e) => {
                    e.stopPropagation();
                    onClick && onClick(job);
                }}
                sx={{
                    mt: 'auto',
                    pt: 1.5,
                    cursor: 'pointer',
                    color: 'primary.main',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    '&:hover': {
                        textDecoration: 'underline',
                    }
                }}
            >
                View Details →
            </Box>
        </Paper>
    );
}
export default SortableJobCard;


/*import { useSortable } from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';
import JobCard from "./JobCard";

function SortableJobCard({job,onClick,onDelete}) {
    const {attributes,listeners,setNodeRef,transform,transition,isDragging} = useSortable({id:job.id});
    const style = {
        transform:CSS.Transform.toString(transform),transition,
        opacity:isDragging ? 0.5 :1,
        cursor:isDragging ? 'grabbing' : 'grab',
    };

    return(
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <JobCard job={job} onClick={onClick} onDelete={onDelete}/>
        </div>
    );
}
export default SortableJobCard; */