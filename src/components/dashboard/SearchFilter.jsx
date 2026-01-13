import { useState } from 'react';
import {Box,TextField,MenuItem,IconButton,Button,Menu,ListItemIcon,ListItemText,
    Chip,InputAdornment,Paper,ToggleButtonGroup,ToggleButton
,Dialog,DialogTitle,DialogContent,DialogActions,} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'; 
import FilterListIcon from '@mui/icons-material/FilterList'; 
import ClearIcon from '@mui/icons-material/Clear'; 
import ViewKanbanIcon from '@mui/icons-material/ViewKanban'; 
import TableRowsIcon from '@mui/icons-material/TableRows'; 
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import SaveIcon from '@mui/icons-material/Save';
import {statusOptions,sourceOptions} from '../../data/mockjobs';


function SearchFilter({searchQuery,onSearchChange,statusFilter,onStatusFilterChange,sourceFilter
    ,onSourceFilterChange,priorityFilter,onPriorityFilterChange,onClearFilters,view,onViewChnage,resultsCount
}){
    const [showFilters,setshowFilters] = useState(false);
    const [savedSearchesAnchor, setSavedSearchesAnchor] = useState(null);
    const [saveSearchDialogOpen, setSaveSearchDialogOpen] = useState(false);
    const [searchName, setSearchName] = useState('');
    // Mock saved searches
    const [savedSearches, setSavedSearches] = useState([
        { id: 1, name: 'High Priority Remote Jobs', query: 'remote', statusFilter: 'all', sourceFilter: 'all', priorityFilter: '4' },
        { id: 2, name: 'Active Applications', query: '', statusFilter: 'applied', sourceFilter: 'all', priorityFilter: 'all' },
    ]);
    const hasActiveFilters = statusFilter !== 'all' || sourceFilter !== 'all' || priorityFilter !== 'all';

    const handleSaveSearch = () => {
        if (!searchName.trim()) return;
        const newSearch = {
        id: Date.now(),
        name: searchName,
        query: searchQuery,
        statusFilter,
        sourceFilter,
        priorityFilter,
        };
        
        setSavedSearches([...savedSearches, newSearch]);
        setSaveSearchDialogOpen(false);
        setSearchName('');
    };

    const handleLoadSearch = (search) => {
        onSearchChange(search.query);
        onStatusFilterChange(search.statusFilter);
        onSourceFilterChange(search.sourceFilter);
        onPriorityFilterChange(search.priorityFilter);
        setSavedSearchesAnchor(null);
    };

    const handleDeleteSearch = (searchId) => {
        setSavedSearches(savedSearches.filter(s => s.id !== searchId));
    };
    return(
        <Paper sx={{p:2,mb:3,bgcolor:'background.paper'}}>
            <Box sx={{display:'flex',gap:2,alignItems:'center',flexWrap:'wrap'}}>
                {/**search bar */}
                <TextField placeholder='search jobs by company,title, or keywords...'
                value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} size='small'
                sx={{flex:1,minWidth:250}} InputProps={{
                    startAdornment:(
                        <InputAdornment position='start'><SearchIcon color='action'/></InputAdornment>
                    ),endAdornment:searchQuery && (
                        <InputAdornment position='end'>
                            <IconButton size='small' onClick={() => onSearchChange('')}>
                                <ClearIcon fontSize='small'/>
                            </IconButton>
                        </InputAdornment>
                    ),
                }}/>
                {/**filter toggle button */}
                <IconButton onClick={() => setshowFilters(!showFilters)} color={hasActiveFilters ? 'primary' : 'default'}
                    sx={{bgcolor:hasActiveFilters ? "primary.light" : 'transparent',
                        '&:hover':{bgcolor:hasActiveFilters ? 'primary.light' : 'action.hover',}
                    }}>
                    <FilterListIcon/>
                </IconButton>
                {/* Saved Searches Button */}
                <IconButton
                onClick={(e) => setSavedSearchesAnchor(e.currentTarget)}
                color={savedSearches.length > 0 ? 'primary' : 'default'}
                >
                <BookmarkIcon />
                </IconButton>
                {/* Save Current Search Button */}
                {(searchQuery || hasActiveFilters) && (
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<SaveIcon />}
                    onClick={() => setSaveSearchDialogOpen(true)}>
                    Save Search
                </Button>
                )}
                {/**view toggle */}
                <ToggleButtonGroup value={view} exclusive onChange={(e,newview) => newview && onViewChnage(newview)} size='small'>
                    <ToggleButton value='kanban'><ViewKanbanIcon fontSize='small'/></ToggleButton>
                    <ToggleButton value='table'><TableRowsIcon fontSize='small'/></ToggleButton>
                </ToggleButtonGroup>
                {/**results count */}
                {resultsCount !== 'undefined' && (
                    <Chip label={`${resultsCount} job${resultsCount !== 1 ? 's' : ''}`}
                    size='small' color='primary' variant='outlined'/>
                )}
            </Box>
            {/**filter options,expandable */}
            {showFilters && (
                <Box sx={{display:'flex',gap:2,mt:2,flexWrap:'wrap',alignItems:'center'}}>
                    {/**status filter */}
                    <TextField select label='Status' value={statusFilter} onChange={(e) => onStatusFilterChange(e.target.value)}
                        size='small' sx={{minWidth:150}}>
                        <MenuItem value='all'>All Statuses</MenuItem>
                        {statusOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                <Box sx={{display:'flex',alignItems:'center',gap:1}}>
                                    <Box sx={{width:10,height:10,borderRadius:'50%',bgcolor:option.color,}}/>
                                    {option.label}
                                </Box>
                            </MenuItem>
                        ))}
                    </TextField>
                    {/**source filter */}
                    <TextField select label='Source' value={sourceFilter}
                    onChange={(e) => onSourceFilterChange(e.target.value)} size='small' sx={{minWidth:150}}>
                        <MenuItem value='all'>All Sources</MenuItem>
                        {sourceOptions.map((option) => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                    </TextField>
                    {/**priority stars filter */}
                    <TextField select label='Priority' value={priorityFilter}
                    onChange={(e) => onPriorityFilterChange(e.target.value)} size='small' sx={{minWidth:150}}>
                        <MenuItem value="all">All Priorities</MenuItem>
                        <MenuItem value="5">⭐⭐⭐⭐⭐ (5)</MenuItem>
                        <MenuItem value="4">⭐⭐⭐⭐ (4+)</MenuItem>
                        <MenuItem value="3">⭐⭐⭐ (3+)</MenuItem>
                        <MenuItem value="2">⭐⭐ (2+)</MenuItem>
                        <MenuItem value="1">⭐ (1+)</MenuItem> 
                    </TextField>
                    {/**clear filters */}
                    {hasActiveFilters && (
                        <Chip label='Clear Filters' onDelete={onClearFilters} color='primary'
                        variant='outlined' deleteIcon={<ClearIcon/>}/>
                    )}
                </Box>
            )}
            {/**active filters display */}
            {hasActiveFilters && !showFilters && (
                <Box sx={{display:'flex',gap:1,mt:2,flexWrap:'wrap'}}>
                    {statusFilter !== 'all' && (
                        <Chip label={`Status: ${statusOptions.find(s => s.value === statusFilter)?.label}`}
                        size='small' onDelete={() => onStatusFilterChange('all')}/>
                    )}
                    {sourceFilter !== 'all' && (
                        <Chip label={`Source: ${sourceFilter}`}
                        size="small" onDelete={() => onSourceFilterChange('all')}/>
                    )}
                    {priorityFilter !== 'all' && (
                        <Chip label={`Source: ${priorityFilter}`}
                        size="small" onDelete={() => onPriorityFilterChange('all')}/>
                    )}
                </Box>
            )}
            {/* Saved Searches Menu */}
            <Menu anchorEl={savedSearchesAnchor} open={Boolean(savedSearchesAnchor)}
            onClose={() => setSavedSearchesAnchor(null)}>
                {savedSearches.length === 0 ? (
                    <MenuItem disabled>
                    <ListItemText primary="No saved searches" />
                    </MenuItem>
                ) : (
                    savedSearches.map((search) => (
                    <MenuItem key={search.id} onClick={() => handleLoadSearch(search)}
                    sx={{ minWidth: 250 }}>
                        <ListItemIcon>
                        <BookmarkBorderIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={search.name} />
                        <IconButton size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSearch(search.id);
                        }}>
                            <ClearIcon fontSize="small" />
                        </IconButton>
                    </MenuItem>
                    ))
                )}
            </Menu>
            {/* Save Search Dialog */}
            <Dialog
            open={saveSearchDialogOpen} onClose={() => setSaveSearchDialogOpen(false)}
            maxWidth="xs" fullWidth>
                <DialogTitle>Save Search</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Search Name" fullWidth
                    value={searchName} onChange={(e) => setSearchName(e.target.value)}
                    placeholder="e.g., Remote React Jobs"/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSaveSearchDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveSearch} variant="contained" disabled={!searchName.trim()}>
                    Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}
export default SearchFilter;