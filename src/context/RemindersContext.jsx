import { createContext, useState, useEffect, useCallback } from 'react';

export const RemindersContext = createContext();

export const RemindersProvider = ({ children, jobs = [] }) => {
  const [reminderSettings, setReminderSettings] = useState(() => {
    const saved = localStorage.getItem('job-tracker-reminders');
    if (saved) return JSON.parse(saved);
    return {
      followUpReminders: true,
      interviewReminders: true,
      weeklyDigest: false,
    };
  });

  const [reminders, setReminders] = useState([]);
  const [weeklyDigestEmail, setWeeklyDigestEmail] = useState('');

  // Save reminder settings to localStorage
  useEffect(() => {
    localStorage.setItem('job-tracker-reminders', JSON.stringify(reminderSettings));
  }, [reminderSettings]);

  // Generate follow-up reminders for jobs that haven't had activity
  const generateFollowUpReminders = useCallback(() => {
    if (!reminderSettings.followUpReminders || jobs.length === 0) return [];

    const today = new Date();
    const followUpReminders = [];

    jobs.forEach(job => {
      if (job.status === 'applied' || job.status === 'interviewing') {
        const lastActivityDate = job.timeline && job.timeline.length > 0
          ? new Date(job.timeline[job.timeline.length - 1].date)
          : new Date(job.appliedDate || today);

        const daysSinceActivity = Math.floor((today - lastActivityDate) / (1000 * 60 * 60 * 24));

        // Remind if more than 7 days have passed
        if (daysSinceActivity >= 7) {
          followUpReminders.push({
            id: `followup-${job.id}`,
            type: 'follow-up',
            jobId: job.id,
            company: job.company,
            position: job.title,
            message: `Follow up with ${job.company} about ${job.title} position (no updates for ${daysSinceActivity} days)`,
            date: today,
            read: false,
          });
        }
      }
    });

    return followUpReminders;
  }, [jobs, reminderSettings.followUpReminders]);

  // Generate interview reminders for upcoming interviews
  const generateInterviewReminders = useCallback(() => {
    if (!reminderSettings.interviewReminders || jobs.length === 0) return [];

    const today = new Date();
    const interviewReminders = [];

    jobs.forEach(job => {
      if (job.status === 'interviewing' && job.interviewDates && Array.isArray(job.interviewDates)) {
        job.interviewDates.forEach(interview => {
          const interviewDate = new Date(interview.date);
          const daysUntilInterview = Math.floor((interviewDate - today) / (1000 * 60 * 60 * 24));

          // Remind 1 day before, 3 days before, and 1 week before
          if (daysUntilInterview === 1 || daysUntilInterview === 3 || daysUntilInterview === 7) {
            interviewReminders.push({
              id: `interview-${job.id}-${interview.date}`,
              type: 'interview-reminder',
              jobId: job.id,
              company: job.company,
              position: job.title,
              interviewType: interview.type || 'Interview',
              message: `Upcoming ${interview.type || 'Interview'} with ${job.company} in ${daysUntilInterview} day(s)`,
              date: today,
              read: false,
            });
          }
        });
      }
    });

    return interviewReminders;
  }, [jobs, reminderSettings.interviewReminders]);

  // Generate weekly digest
  const generateWeeklyDigest = useCallback(() => {
    if (!reminderSettings.weeklyDigest || jobs.length === 0) return null;

    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const applicationsThisWeek = jobs.filter(job => {
      const appliedDate = new Date(job.appliedDate || today);
      return appliedDate >= lastWeek && appliedDate <= today;
    }).length;

    const interviewsThisWeek = jobs.filter(job => {
      if (!job.interviewDates || !Array.isArray(job.interviewDates)) return false;
      return job.interviewDates.some(interview => {
        const interviewDate = new Date(interview.date);
        return interviewDate >= lastWeek && interviewDate <= today;
      });
    }).length;

    const offersThisWeek = jobs.filter(job => {
      if (job.status !== 'offer') return false;
      const offerDate = new Date(job.offerDate || today);
      return offerDate >= lastWeek && offerDate <= today;
    }).length;

    return {
      id: `weekly-digest-${today.toISOString().split('T')[0]}`,
      type: 'weekly-digest',
      week: `${lastWeek.toLocaleDateString()} - ${today.toLocaleDateString()}`,
      applicationsThisWeek,
      interviewsThisWeek,
      offersThisWeek,
      totalStats: {
        totalApplications: jobs.length,
        activeApplications: jobs.filter(j => j.status === 'applied' || j.status === 'interviewing').length,
        interviews: jobs.filter(j => j.status === 'interviewing').length,
        offers: jobs.filter(j => j.status === 'offer').length,
      },
      date: today,
      read: false,
    };
  }, [jobs, reminderSettings.weeklyDigest]);

  // Update reminders whenever jobs or settings change
  useEffect(() => {
    const followUpReminders = generateFollowUpReminders();
    const interviewReminders = generateInterviewReminders();
    
    setReminders([...followUpReminders, ...interviewReminders]);
  }, [generateFollowUpReminders, generateInterviewReminders]);

  const updateReminderSettings = useCallback((newSettings) => {
    setReminderSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  }, []);

  const markReminderAsRead = useCallback((reminderId) => {
    setReminders(prev =>
      prev.map(r => r.id === reminderId ? { ...r, read: true } : r)
    );
  }, []);

  const clearReminder = useCallback((reminderId) => {
    setReminders(prev => prev.filter(r => r.id !== reminderId));
  }, []);

  return (
    <RemindersContext.Provider
      value={{
        reminderSettings,
        reminders,
        weeklyDigestEmail,
        setWeeklyDigestEmail,
        updateReminderSettings,
        generateFollowUpReminders,
        generateInterviewReminders,
        generateWeeklyDigest,
        markReminderAsRead,
        clearReminder,
      }}
    >
      {children}
    </RemindersContext.Provider>
  );
};
