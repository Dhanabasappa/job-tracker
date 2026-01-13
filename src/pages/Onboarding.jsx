import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Chip,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { motion } from 'framer-motion';
import { ProfileContext } from '../context/ProfileContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const MotionBox = motion.create(Box);

const steps = [
  'Personal Info',
  'Current Job',
  'Job Preferences',
  'Technical Skills',
  'Interests',
  'Connect Profiles',
];

const technicalSkills = [
  'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular',
  'Node.js', 'Python', 'Java', 'C++', 'C#',
  'GraphQL', 'REST API', 'SQL', 'MongoDB', 'PostgreSQL',
  'AWS', 'Docker', 'Kubernetes', 'Git', 'System Design',
  'HTML', 'CSS', 'Tailwind CSS', 'Material-UI', 'Next.js',
];

const interestsList = [
  'Frontend Development',
  'Backend Development',
  'Full Stack',
  'DevOps',
  'Data Science',
  'Machine Learning',
  'Cybersecurity',
  'Mobile Development',
  'Blockchain',
  'Cloud Architecture',
  'System Design',
  'Open Source',
];

function Onboarding() {
  const navigate = useNavigate();
  const { completeOnboarding } = useContext(ProfileContext);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal Info
    name: '',
    email: '',
    phone: '',
    location: '',
    
    // Current Job
    currentJobTitle: '',
    currentCompany: '',
    yearsOfExperience: '0',
    
    // Job Preferences
    targetRole: '',
    targetCompanies: [],
    desiredSalary: '',
    willingToRelocate: false,
    remotePreference: 'Any',
    
    // Skills
    skills: [],
    technicalBackground: '',
    
    // Interests
    interests: [],
    
    // Links
    linkedin: '',
    github: '',
    portfolio: '',
  });

  const [newCompany, setNewCompany] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleAddCompany = () => {
    if (newCompany.trim() && !formData.targetCompanies.includes(newCompany.trim())) {
      setFormData(prev => ({
        ...prev,
        targetCompanies: [...prev.targetCompanies, newCompany.trim()],
      }));
      setNewCompany('');
    }
  };

  const handleRemoveCompany = (company) => {
    setFormData(prev => ({
      ...prev,
      targetCompanies: prev.targetCompanies.filter(c => c !== company),
    }));
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0: // Personal Info
        return formData.name && formData.email && formData.phone && formData.location;
      case 1: // Current Job
        return formData.currentJobTitle && formData.yearsOfExperience;
      case 2: // Job Preferences
        return formData.targetRole && formData.desiredSalary && formData.remotePreference;
      case 3: // Skills
        return formData.skills.length > 0;
      case 4: // Interests
        return formData.interests.length > 0;
      case 5: // Links
        return true; // Optional step
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (isStepValid() || activeStep === 5) {
      if (activeStep === steps.length - 1) {
        // Complete onboarding
        completeOnboarding(formData);
        navigate('/dashboard');
      } else {
        setActiveStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0: // Personal Info
        return (
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}><Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Let's start with the basics
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}><TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}><TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}><TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}><TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="San Francisco, CA"
                />
              </Grid>
            </Grid>
          </MotionBox>
        );

      case 1: // Current Job
        return (
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}><Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Tell us about your current role
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}><TextField
                  fullWidth
                  label="Current Job Title"
                  name="currentJobTitle"
                  value={formData.currentJobTitle}
                  onChange={handleInputChange}
                  placeholder="Senior Frontend Developer"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}><TextField
                  fullWidth
                  label="Current Company"
                  name="currentCompany"
                  value={formData.currentCompany}
                  onChange={handleInputChange}
                  placeholder="Tech Company Inc."
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}><FormControl fullWidth>
                  <InputLabel>Years of Experience</InputLabel>
                  <Select
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    label="Years of Experience"
                  >
                    {[...Array(40)].map((_, i) => (
                      <MenuItem key={i} value={String(i)}>
                        {i} years
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}><TextField
                  fullWidth
                  label="Brief Background"
                  name="technicalBackground"
                  value={formData.technicalBackground}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  placeholder="Tell us about your technical background..."
                />
              </Grid>
            </Grid>
          </MotionBox>
        );

      case 2: // Job Preferences
        return (
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}><Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  What are you looking for?
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}><TextField
                  fullWidth
                  label="Target Role"
                  name="targetRole"
                  value={formData.targetRole}
                  onChange={handleInputChange}
                  placeholder="Staff Engineer, Tech Lead, etc."
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}><FormControl fullWidth>
                  <InputLabel>Remote Preference</InputLabel>
                  <Select
                    name="remotePreference"
                    value={formData.remotePreference}
                    onChange={handleInputChange}
                    label="Remote Preference"
                  >
                    <MenuItem value="Remote">Remote</MenuItem>
                    <MenuItem value="Hybrid">Hybrid</MenuItem>
                    <MenuItem value="On-site">On-site</MenuItem>
                    <MenuItem value="Any">Any</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}><TextField
                  fullWidth
                  label="Desired Salary Range"
                  name="desiredSalary"
                  value={formData.desiredSalary}
                  onChange={handleInputChange}
                  placeholder="$150,000 - $200,000"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}><FormControlLabel
                  control={
                    <Checkbox
                      name="willingToRelocate"
                      checked={formData.willingToRelocate}
                      onChange={handleInputChange}
                    />
                  }
                  label="Willing to Relocate"
                />
              </Grid>
              <Grid size={{ xs: 12 }}><Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                  Target Companies
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  {formData.targetCompanies.map((company, idx) => (
                    <Chip
                      key={idx}
                      label={company}
                      onDelete={() => handleRemoveCompany(company)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    placeholder="Add a company (e.g., Google, Meta)"
                    size="small"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCompany()}
                  />
                  <Button variant="contained" onClick={handleAddCompany}>
                    Add
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </MotionBox>
        );

      case 3: // Technical Skills
        return (
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}><Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Select your technical skills
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}><Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {technicalSkills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      onClick={() => handleSkillToggle(skill)}
                      color={formData.skills.includes(skill) ? 'primary' : 'default'}
                      variant={formData.skills.includes(skill) ? 'filled' : 'outlined'}
                      sx={{ cursor: 'pointer', mb: 1 }}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid size={{ xs: 12 }}><Typography variant="body2" color="textSecondary">
                  Selected: {formData.skills.length} skills
                </Typography>
              </Grid>
            </Grid>
          </MotionBox>
        );

      case 4: // Interests
        return (
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}><Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  What interests you most?
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}><Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {interestsList.map((interest) => (
                    <Chip
                      key={interest}
                      label={interest}
                      onClick={() => handleInterestToggle(interest)}
                      color={formData.interests.includes(interest) ? 'secondary' : 'default'}
                      variant={formData.interests.includes(interest) ? 'filled' : 'outlined'}
                      sx={{ cursor: 'pointer', mb: 1 }}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid size={{ xs: 12 }}><Typography variant="body2" color="textSecondary">
                  Selected: {formData.interests.length} interests
                </Typography>
              </Grid>
            </Grid>
          </MotionBox>
        );

      case 5: // Connect Profiles
        return (
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}><Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Connect your profiles (Optional)
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}><TextField
                  fullWidth
                  label="LinkedIn Profile"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">linkedin.com/in/</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}><TextField
                  fullWidth
                  label="GitHub Profile"
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                  placeholder="https://github.com/yourprofile"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">github.com/</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}><TextField
                  fullWidth
                  label="Portfolio Website"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleInputChange}
                  placeholder="https://yourportfolio.com"
                />
              </Grid>
              <Grid size={{ xs: 12 }}><Typography variant="body2" color="textSecondary">
                  You can skip this step and update these later from your profile
                </Typography>
              </Grid>
            </Grid>
          </MotionBox>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        backdropFilter: 'blur(10px)',
        minHeight: '100vh',
        width: '100vw',
        zIndex: 1000,
      }}
    >
      {/* Blurred overlay background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(8px)',
          zIndex: 0,
        }}
      />
      
      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 700, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 'auto', py: 4 }}>
        <Card sx={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)', borderRadius: 3, width: '100%' }}>
          <CardContent sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Welcome to JobTrackr
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Let's set up your profile to get started
              </Typography>
            </Box>

            {/* Stepper */}
            <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Step Content */}
            <Box sx={{ minHeight: 250, mb: 3 }}>
              {renderStepContent()}
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                startIcon={<ArrowBackIcon />}
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                variant="contained"
                disabled={!isStepValid() && activeStep !== 5}
                endIcon={activeStep === steps.length - 1 ? undefined : <ArrowForwardIcon />}
              >
                {activeStep === steps.length - 1 ? 'Complete' : 'Next'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default Onboarding;





