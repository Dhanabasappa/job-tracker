import { createContext, useState, useEffect } from 'react';

export const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize profile from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    const savedIsComplete = localStorage.getItem('isProfileComplete');
    
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
      setIsProfileComplete(savedIsComplete === 'true');
    }
    setLoading(false);
  }, []);

  // Update profile function
  const updateProfile = (newProfileData) => {
    const updatedProfile = {
      ...profile,
      ...newProfileData,
    };
    setProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
  };

  // Mark first time user as done
  const markFirstTimeComplete = () => {
    if (profile) {
      const updatedProfile = {
        ...profile,
        isFirstTimeUser: false,
      };
      setProfile(updatedProfile);
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    }
  };

  // Complete onboarding and set profile
  const completeOnboarding = (onboardingData) => {
    const completeProfile = {
      // Personal Info
      name: onboardingData.name,
      email: onboardingData.email,
      phone: onboardingData.phone,
      location: onboardingData.location,
      
      // Current Job Info
      title: onboardingData.currentJobTitle || '',
      company: onboardingData.currentCompany || '',
      yearsOfExperience: onboardingData.yearsOfExperience || '0',
      
      // Job Preferences
      targetRole: onboardingData.targetRole,
      targetCompanies: onboardingData.targetCompanies || [],
      desiredSalary: onboardingData.desiredSalary || '',
      willingToRelocate: onboardingData.willingToRelocate || false,
      remotePreference: onboardingData.remotePreference || 'Any',
      
      // Technical Background
      skills: onboardingData.skills || [],
      technicalBackground: onboardingData.technicalBackground || '',
      
      // Interests
      interests: onboardingData.interests || [],
      
      // Links
      linkedin: onboardingData.linkedin || '',
      github: onboardingData.github || '',
      portfolio: onboardingData.portfolio || '',
      
      // Resume
      resumeUrl: null,
      
      // First time flag
      isFirstTimeUser: true,
      onboardingCompletedAt: new Date().toISOString(),
    };
    
    setProfile(completeProfile);
    setIsProfileComplete(true);
    localStorage.setItem('userProfile', JSON.stringify(completeProfile));
    localStorage.setItem('isProfileComplete', 'true');
  };

  // Reset profile
  const resetProfile = () => {
    setProfile(null);
    setIsProfileComplete(false);
    localStorage.removeItem('userProfile');
    localStorage.removeItem('isProfileComplete');
  };

  const value = {
    profile,
    isProfileComplete,
    loading,
    updateProfile,
    markFirstTimeComplete,
    completeOnboarding,
    resetProfile,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}
