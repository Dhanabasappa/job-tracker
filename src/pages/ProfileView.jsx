// src/components/dashboard/ProfileView.jsx
import { useState, useContext, useEffect } from 'react';
import {Box,Paper,Typography,TextField,Grid,
    Button,Avatar,Chip,IconButton,Alert,Divider,} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import { ProfileContext } from '../context/ProfileContext';

function ProfileView() {
  const { profile: contextProfile, updateProfile } = useContext(ProfileContext);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Use context profile or fallback to default
  const defaultProfile = {
    name: 'User',
    email: 'user@email.com',
    phone: '+1 (555) 000-0000',
    location: 'United States',
    title: 'Developer',
    yearsOfExperience: '0',
    targetRole: 'Role',
    targetCompanies: [],
    desiredSalary: '',
    willingToRelocate: false,
    remotePreference: 'Any',
    skills: [],
    linkedin: '',
    github: '',
    portfolio: '',
    resumeUrl: null,
    interests: [],
    technicalBackground: '',
  };

  const [profile, setProfile] = useState(contextProfile || defaultProfile);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [newSkill, setNewSkill] = useState('');
  const [newCompany, setNewCompany] = useState('');

  // Sync with context profile
  useEffect(() => {
    if (contextProfile) {
      setProfile(contextProfile);
      setEditedProfile(contextProfile);
    }
  }, [contextProfile]);

  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    updateProfile(editedProfile);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleChange = (field) => (event) => {
    setEditedProfile({
      ...editedProfile,
      [field]: event.target.value,
    });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !editedProfile.skills.includes(newSkill.trim())) {
      setEditedProfile({
        ...editedProfile,
        skills: [...editedProfile.skills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setEditedProfile({
      ...editedProfile,
      skills: editedProfile.skills.filter(s => s !== skillToRemove),
    });
  };

  const handleAddCompany = () => {
    if (newCompany.trim() && !editedProfile.targetCompanies.includes(newCompany.trim())) {
      setEditedProfile({
        ...editedProfile,
        targetCompanies: [...editedProfile.targetCompanies, newCompany.trim()],
      });
      setNewCompany('');
    }
  };

  const handleRemoveCompany = (companyToRemove) => {
    setEditedProfile({
      ...editedProfile,
      targetCompanies: editedProfile.targetCompanies.filter(c => c !== companyToRemove),
    });
  };

  const handleResumeUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // In real app, would upload to server/cloud storage
      console.log('Uploading resume:', file.name);
      setEditedProfile({
        ...editedProfile,
        resumeUrl: file.name,
      });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>👤 Profile</Typography>
        {!isEditing ? (
          <Button variant="outlined" startIcon={<EditIcon />} onClick={handleEdit}>
            Edit Profile
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" startIcon={<CancelIcon />} onClick={handleCancel}>Cancel</Button>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>Save</Button>
          </Box>
        )}
      </Box>

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Profile updated successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Header Card */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
              <Avatar sx={{width: 100,height: 100,fontSize: '2.5rem',bgcolor: 'primary.main',}}>
                {profile.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                {isEditing ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="Full Name"
                      value={editedProfile.name}
                      onChange={handleChange('name')}
                      fullWidth
                    />
                    <TextField
                      label="Current Title"
                      value={editedProfile.title}
                      onChange={handleChange('title')}
                      fullWidth
                    />
                  </Box>
                ) : (
                  <>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {profile.name}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                      {profile.title}
                    </Typography>
                    <Chip
                      label={`${profile.yearsOfExperience} years experience`}
                      size="small"
                      color="primary"
                    />
                  </>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Contact Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Contact Information
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {isEditing ? (
                <>
                  <TextField
                    label="Email"
                    type="email"
                    value={editedProfile.email}
                    onChange={handleChange('email')}
                    fullWidth
                    InputProps={{ startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} /> }}
                  />
                  <TextField
                    label="Phone"
                    value={editedProfile.phone}
                    onChange={handleChange('phone')}
                    fullWidth
                    InputProps={{ startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} /> }}
                  />
                  <TextField
                    label="Location"
                    value={editedProfile.location}
                    onChange={handleChange('location')}
                    fullWidth
                    InputProps={{ startAdornment: <LocationOnIcon sx={{ mr: 1, color: 'action.active' }} /> }}
                  />
                </>
              ) : (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon color="action" />
                    <Typography>{profile.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon color="action" />
                    <Typography>{profile.phone}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon color="action" />
                    <Typography>{profile.location}</Typography>
                  </Box>
                </>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Online Presence */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Online Presence
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {isEditing ? (
                <>
                  <TextField
                    label="LinkedIn"
                    value={editedProfile.linkedin}
                    onChange={handleChange('linkedin')}
                    fullWidth
                    InputProps={{ startAdornment: <LinkedInIcon sx={{ mr: 1, color: 'action.active' }} /> }}
                  />
                  <TextField
                    label="GitHub"
                    value={editedProfile.github}
                    onChange={handleChange('github')}
                    fullWidth
                    InputProps={{ startAdornment: <GitHubIcon sx={{ mr: 1, color: 'action.active' }} /> }}
                  />
                  <TextField
                    label="Portfolio"
                    value={editedProfile.portfolio}
                    onChange={handleChange('portfolio')}
                    fullWidth
                    InputProps={{ startAdornment: <LanguageIcon sx={{ mr: 1, color: 'action.active' }} /> }}
                  />
                </>
              ) : (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinkedInIcon color="action" />
                    <Typography
                      component="a"
                      href={profile.linkedin}
                      target="_blank"
                      sx={{ textDecoration: 'none', color: 'primary.main' }}
                    >
                      LinkedIn Profile
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GitHubIcon color="action" />
                    <Typography
                      component="a"
                      href={profile.github}
                      target="_blank"
                      sx={{ textDecoration: 'none', color: 'primary.main' }}
                    >
                      GitHub Profile
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LanguageIcon color="action" />
                    <Typography
                      component="a"
                      href={profile.portfolio}
                      target="_blank"
                      sx={{ textDecoration: 'none', color: 'primary.main' }}
                    >
                      Portfolio Website
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Career Goals */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Career Goals & Preferences
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Target Role"
                  value={isEditing ? editedProfile.targetRole : profile.targetRole}
                  onChange={handleChange('targetRole')}
                  fullWidth
                  disabled={!isEditing}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Desired Salary Range"
                  value={isEditing ? editedProfile.desiredSalary : profile.desiredSalary}
                  onChange={handleChange('desiredSalary')}
                  fullWidth
                  disabled={!isEditing}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  label="Remote Preference"
                  value={isEditing ? editedProfile.remotePreference : profile.remotePreference}
                  onChange={handleChange('remotePreference')}
                  fullWidth
                  disabled={!isEditing}
                  SelectProps={{ native: true }}
                >
                  <option value="Remote">Fully Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                  <option value="Flexible">Flexible</option>
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Years of Experience"
                  type="number"
                  value={isEditing ? editedProfile.yearsOfExperience : profile.yearsOfExperience}
                  onChange={handleChange('yearsOfExperience')}
                  fullWidth
                  disabled={!isEditing}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Target Companies */}
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Target Companies
            </Typography>
            
            {isEditing && (
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  size="small"
                  placeholder="Add target company"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCompany()}
                  fullWidth
                />
                <Button variant="outlined" onClick={handleAddCompany}>
                  Add
                </Button>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {(isEditing ? editedProfile : profile).targetCompanies.map((company, index) => (
                <Chip
                  key={index}
                  label={company}
                  color="primary"
                  variant="outlined"
                  onDelete={isEditing ? () => handleRemoveCompany(company) : undefined}
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Skills */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Skills & Expertise
            </Typography>

            {isEditing && (
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  size="small"
                  placeholder="Add skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  fullWidth
                />
                <Button variant="outlined" onClick={handleAddSkill}>
                  Add
                </Button>
              </Box>
            )}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {(isEditing ? editedProfile : profile).skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  color="primary"
                  onDelete={isEditing ? () => handleRemoveSkill(skill) : undefined}
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Resume Upload */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Master Resume
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              {profile.resumeUrl ? (
                <>
                  <Chip
                    label={profile.resumeUrl}
                    color="success"
                    icon={<WorkIcon />}
                  />
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                  >
                    Replace Resume
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                    />
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Master Resume
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                  />
                </Button>
              )}
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
              Upload your master resume to use as a base for tailored applications
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProfileView;