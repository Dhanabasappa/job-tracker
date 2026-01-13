import { useState } from "react";
import { format } from "date-fns";
import {Box,Paper,Typography,Button,Card,CardContent,CardActions,IconButton,
    Chip,Dialog,DialogTitle,DialogContent,DialogActions,TextField,MenuItem,
    List,ListItem,ListItemText,ListItemIcon,Grid,Divider} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

function DocumentsView({jobs,onUpdateJob}){
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [uploadData, setUploadData] = useState({name: '',type: 'resume',jobId: '',file: null,});
  // Documents start empty - only show user-uploaded documents
  const[documents,setDocuments] = useState([]);

  const documentTypes = [
    { value: 'resume', label: 'Resume', icon: <DescriptionIcon /> },
    { value: 'cover_letter', label: 'Cover Letter', icon: <DescriptionIcon /> },
    { value: 'portfolio', label: 'Portfolio', icon: <FolderIcon /> },
    { value: 'other', label: 'Other', icon: <InsertDriveFileIcon /> },
  ];

    //handle file selection
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if(file){
            setUploadData({...uploadData,file:file,name:uploadData.name || file.name,});
        }
    };
    
    //handle upload
    const handleUpload = () => {
    if (!uploadData.file) return;
    const newDocument = {
      id: Date.now(),
      name: uploadData.name,
      type: uploadData.type,
      size: `${Math.round(uploadData.file.size / 1024)} KB`,
      uploadDate: new Date().toISOString().split('T')[0],
      jobId: uploadData.jobId || null,
      jobName: uploadData.jobId 
        ? jobs.find(j => j.id === parseInt(uploadData.jobId))?.company + ' - ' + 
          jobs.find(j => j.id === parseInt(uploadData.jobId))?.title
        : 'General',
    };
    setDocuments([...documents, newDocument]);
    setUploadDialogOpen(false);
    setUploadData({ name: '', type: 'resume', jobId: '', file: null });
  };

  //handle delete
  const handleDelete = (docId) => {
    setDocuments(documents.filter(doc => doc.id !== docId));
  };

  // Handle preview
  const handlePreview = (doc) => {
    setSelectedDocument(doc);
    setPreviewDialogOpen(true);
  };

  // Get icon for document type
  const getDocumentIcon = (type) => {
    const docType = documentTypes.find(t => t.value === type);
    return docType ? docType.icon : <InsertDriveFileIcon />;
  };

  // Group documents by type
  const documentsByType = documentTypes.reduce((acc, type) => {
    acc[type.value] = documents.filter(doc => doc.type === type.value);
    return acc;
  }, {});

  return(
    <Box>
        {/**header */}
        <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center',mb:3}}>
            <Typography variant="h4" sx={{fontWeight:700}}>📄 Documents</Typography>
            <Button variant="contained" startIcon={<UploadFileIcon/>} onClick={() => setUploadDialogOpen(true)}>Upload Document</Button>
        </Box>
        {/**summary cards */}
        <Grid container spacing={3} sx={{mb:4}}>
            <Grid size={{xs:12,sm:6,md:4}}>
                <Paper sx={{p:2,textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:120}}>
                    <Typography variant="h5" sx={{fontWeight:700,color:'success.main'}}>
                        {documents.filter(d => d.type === 'cover_letter').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Cover Letters</Typography>
                </Paper>
            </Grid>
            <Grid size={{xs:12,sm:6,md:4}}>
                <Paper sx={{p:2,textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:120}}>
                    <Typography variant="h5" sx={{fontWeight:700,color:'info.main'}}>
                        {documents.filter(d => d.jobId).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Linked to Jobs</Typography>
                </Paper>
            </Grid>
        </Grid>
        {/**dosument by type */}
        <Grid container spacing={4}>
            {documentTypes.map((type) => {
                const typeDocs = documentsByType[type.value];
                if(typeDocs.length === 0) return null;
                return(
                    <Grid size={{xs:12,sm:6,md:6,lg:4}} key={type.value}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                {type.icon}
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {type.label}s ({typeDocs.length})
                                </Typography>
                            </Box>
                            <Grid container spacing={2}>
                                {typeDocs.map((doc) => (
                                    <Grid size={{xs:12}} key={doc.id}>
                                        <Card sx={{height:'100%'}}>
                                            <CardContent>
                                                <Box sx={{display:'flex',alignItems:'flex-start',mb:2}}>
                                                    <Box sx={{width:48,height:48,borderRadius:2,bgcolor:'primary.light',
                                                        display:'flex',alignItems:'center',color:'primary.main',mr:2,}}>
                                                        <PictureAsPdfIcon/>
                                                    </Box>
                                                    <Box sx={{flex:1,minWidth:0}}>
                                                        <Typography variant="subtitle1" sx={{fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                                                            {doc.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {doc.size} • {format(new Date(doc.uploadDate),'MMM dd, yyyy')}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                {doc.jobName && (
                                                    <Chip label={doc.jobName} size="small" sx={{mt:1}} color="primary" variant="outlined"/>
                                                )}
                                            </CardContent>
                                            <Divider/>
                                            <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                                                <Box>
                                                    <IconButton size="small" onClick={() => handlePreview(doc)}>
                                                    <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton size="small">
                                                    <DownloadIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                                <IconButton size="small" color="error" onClick={() => handleDelete(doc.id)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Grid>
                );
            })}
        </Grid>
        {/**empty state */}
        {documents.length === 0 && (
            <Paper sx={{ p: 6, textAlign: 'center' }}>
            <UploadFileIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>No documents yet</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
                Upload your resumes, cover letters, and other documents
            </Typography>
            <Button variant="contained" startIcon={<UploadFileIcon />} onClick={() => setUploadDialogOpen(true)}>
                Upload Your First Document
            </Button>
            </Paper>
        )}
        <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth='sm' fullWidth>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogContent>
                <Box sx={{display:'flex',flexDirection:'column',gap:2,mt:1}}>
                    {/* File Upload */}
                    <Button variant="outlined" component="label" startIcon={<UploadFileIcon />} fullWidth>
                    {uploadData.file ? uploadData.file.name : 'Choose File'}
                    <input type="file" hidden accept=".pdf,.doc,.docx,.txt" onChange={handleFileSelect}/>
                    </Button>
                    {/* Document Name */}
                    <TextField label="Document Name" value={uploadData.name} onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })} fullWidth
                    required/>
                    {/* Document Type */}
                    <TextField select label="Document Type" value={uploadData.type}
                    onChange={(e) => setUploadData({ ...uploadData, type: e.target.value })} fullWidth required>
                        {documentTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {type.icon}
                                    {type.label}
                                </Box>
                            </MenuItem>
                        ))}
                    </TextField>
                    {/* Link to Job */}
                    <TextField select label="Link to Job (Optional)" value={uploadData.jobId}
                    onChange={(e) => setUploadData({ ...uploadData, jobId: e.target.value })} fullWidth>
                        <MenuItem value="">None (General)</MenuItem>
                        {jobs.map((job) => (
                            <MenuItem key={job.id} value={job.id}>
                            {job.company} - {job.title}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleUpload} variant="contained"
                    disabled={!uploadData.file || !uploadData.name}>
                    Upload
                </Button>
            </DialogActions>
        </Dialog>
        {/* Preview Dialog */}
        <Dialog open={previewDialogOpen} onClose={() => setPreviewDialogOpen(false)}
            maxWidth="md" fullWidth>
            <DialogTitle>{selectedDocument?.name}</DialogTitle>
            <DialogContent>
                <Box sx={{bgcolor:'background.default',p:4,borderRadius:2,textAlign:'center',minHeight:400,
                    display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                    <PictureAsPdfIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 1 }}>Document Preview</Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                    In a real application, the document would be displayed here.
                    </Typography>
                    <List sx={{ width: '100%', maxWidth: 400 }}>
                        <ListItem>
                            <ListItemText primary="Name" secondary={selectedDocument?.name} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Type" secondary={selectedDocument?.type} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Size" secondary={selectedDocument?.size} />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                            primary="Upload Date"
                            secondary={selectedDocument?.uploadDate && format(new Date(selectedDocument.uploadDate), 'MMMM dd, yyyy')}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Linked to" secondary={selectedDocument?.jobName} />
                        </ListItem>
                    </List>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setPreviewDialogOpen(false)}>Close</Button>
                <Button variant="contained" startIcon={<DownloadIcon />}>Download</Button>
            </DialogActions>
        </Dialog>
    </Box>
  );
}
export default DocumentsView;