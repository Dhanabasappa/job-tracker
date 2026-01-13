import { useState, useEffect, useContext, useRef } from 'react';
import {
  Box,Card,Typography,Button,Chip,Paper,CircularProgress,} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { ProfileContext } from '../../context/ProfileContext';
import { searchJobs, enrichJobData, calculateMatchScore,  buildSearchQuery, dedupeJobs } from '../../services/jobSearchService';

function AllJobsView({ jobs, onJobClick, onDeleteJob, onAddJob, isFirstTime = false }) {
  //search & sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [hasSearched, setHasSearched] = useState(false);
  //loading states
  const [loading, setLoading] = useState(false);
  const [loadingMoreJobs, setLoadingMoreJobs] = useState(false);
  //job data
  const [apiJobs, setApiJobs] = useState([]);
  const [initialApiJobsCount, setInitialApiJobsCount] = useState(0); // Track how many jobs from initial API search
  const [wishlistJobIds, setWishlistJobIds] = useState(
    new Set(jobs.filter(j => j.status === 'wishlist').map(j => j.id)));
  //paginations
  const [diverseJobPage,setDiverseJobPage] = useState(0);
  const [diverseJobsLoaded,setDiverseJobsLoaded] = useState(false);
  // refs and context
  const { profile } = useContext(ProfileContext);
  const fetchedRef = useRef(false);
  const cacheRef = useRef({ jobs: [], timestamp: null });
  const scrollObserverRef = useRef(null); // For infinite scroll

  // Fetch diverse jobs from different backgrounds/fields (pagination-based)
  const fetchDiverseOtherJobs = async (pageNumber = 0) => {
    try {
      setLoadingMoreJobs(true); 
      const allBackgrounds = [
        'Finance Analyst', 'Aerospace Engineer', 'Software Engineer', 'Data Scientist', 'UX Designer',
        'Product Manager', 'DevOps Engineer', 'Machine Learning Engineer', 'Business Analyst', 'Systems Administrator',
        'Electrical Engineer', 'Mechanical Engineer', 'Civil Engineer', 'Accountant', 'Marketing Manager',
        'Sales Representative', 'HR Manager', 'Project Manager', 'Quality Assurance', 'Network Administrator'
      ];
      // Get 5 backgrounds for this page (pagination)
      const startIdx = pageNumber * 5;
      const endIdx = startIdx + 5;
      const backgroundsToFetch = allBackgrounds.slice(startIdx, endIdx);
      // If no more backgrounds, stop
      if (backgroundsToFetch.length === 0) {
        // no-op when no more categories
        setLoadingMoreJobs(false);
        return;
      }
      // Fetch jobs for each background
      const diverseJobPromises = backgroundsToFetch.map(background =>
        searchJobs({ query: background, page: 1, num_pages: 1, date_posted: 'month' })
          .catch(error => {
            console.error(`❌ [AllJobsView] Error fetching ${background}:`, error);
            return [];
          })
      );
      const resultsArray = await Promise.all(diverseJobPromises);
      // Flatten and combine all results
      const allDiverseJobs = resultsArray.flat().filter(job => job);
      if (allDiverseJobs.length > 0) {
        // Enrich and calculate match scores
        const enrichedDiverseJobs = enrichJobData(allDiverseJobs);
        const diverseJobsWithScores = enrichedDiverseJobs
          .map(job => ({
            ...job,
            matchScore: calculateMatchScore(job, profile),
          }))
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, 10); // 10 jobs per page/batch

        // Append to apiJobs list without replacing primary results
        setApiJobs(prev => [...prev, ...diverseJobsWithScores]);
        setDiverseJobPage(pageNumber + 1);
      }
    } catch (error) {
      console.error('💥 [AllJobsView] Error fetching diverse jobs:', error);
    } finally {
      setLoadingMoreJobs(false); // Hide loading indicator
      if (pageNumber === 0) {
        setDiverseJobsLoaded(true); // Mark as loaded after first batch
      }
    }
  };

  // Infinite scroll observer - automatically load more when sentinel is visible
  useEffect(() => {
    if (!diverseJobsLoaded || !scrollObserverRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loadingMoreJobs) {
          // Infinite scroll triggered
          fetchDiverseOtherJobs(diverseJobPage);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(scrollObserverRef.current);
    return () => observer.disconnect();
  }, [diverseJobsLoaded, diverseJobPage, loadingMoreJobs, fetchDiverseOtherJobs]);

  // Fetch API jobs based on user skills when component mounts and profile has skills
  useEffect(() => {
    if (profile?.skills && profile.skills.length > 0) {
      fetchJobsBasedOnSkills();
    }
  }, [isFirstTime, profile?.skills]);

  const fetchJobsBasedOnSkills = async () => {
    try {
      // Check if we have cached data from recent fetch (within 10 minutes)
      if (fetchedRef.current && cacheRef.current.jobs.length > 0) {
        const cacheAge = Date.now() - (cacheRef.current.timestamp || 0);
        if (cacheAge < 10 * 60 * 1000) { // 10 minutes cache duration
          console.log('💾 [AllJobsView] Using cached API results instead of refetching');
          const cachedJobs = cacheRef.current.jobs;
          setApiJobs(cachedJobs);
          setHasSearched(true);
          setDiverseJobsLoaded(false);
          return;
        }
      }

      setLoading(true);

      // Use centralized query builder
      const searchQuery = buildSearchQuery(profile);

      // Search for jobs
      const results = await searchJobs({ query: searchQuery, page: 1, num_pages: 1, date_posted: 'month', remote_jobs_only: profile?.remotePreference === 'Remote' });

      if (results && results.length > 0) {
        // Enrich job data
        const enrichedJobs = enrichJobData(results);
        // enriched jobs computed

        // Calculate match scores
        const jobsWithScores = enrichedJobs
          .map(job => ({
            ...job,
            matchScore: calculateMatchScore(job, profile),
          }))
          .sort((a, b) => b.matchScore - a.matchScore);
      
        if (jobsWithScores.length > 0) {
          // Cache the results and set API jobs
          cacheRef.current = {
            jobs: jobsWithScores,
            timestamp: Date.now()
          };
          fetchedRef.current = true;
          setApiJobs(jobsWithScores);
          setInitialApiJobsCount(jobsWithScores.length); // Track initial count
        }
      }
    } catch (error) {
      console.error('💥 [AllJobsView] Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get status label
  const getStatusLabel = (status) => {
    const statusMap = {
      wishlist: 'Wishlist',
      applied: 'Applied',
      interviewing: 'Interviewing',
      rejected: 'Rejected',
      offer: 'Offer',
    };
    return statusMap[status] || status;
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    const colorMap = {
      wishlist: '#94a3b8',
      applied: '#3b82f6',
      interviewing: '#f59e0b',
      rejected: '#ef4444',
      offer: '#10b981',
    };
    return colorMap[status] || '#94a3b8';
  };

  // Improved search function with smart company matching
  const smartSearch = (job, query) => {
    if (!query || query.trim() === '') return true;

    const searchLower = query.toLowerCase().trim();
    const companyName = (job.employer_name || job.company || '').toLowerCase();
    const jobTitle = (job.job_title || job.title || '').toLowerCase();
    const jobDescription = (job.job_description || job.description || '').toLowerCase();
    const normalizedCompany = job.normalizedCompany?.toLowerCase() || companyName;

    // Check for company name matches (partial and normalized)
    const companyMatch = 
      companyName.includes(searchLower) ||
      normalizedCompany.includes(searchLower) ||
      searchLower.includes(normalizedCompany); // Match if search term is part of normalized name

    // Check for job title matches
    const titleMatch = jobTitle.includes(searchLower);

    // Check for technology/skill matches
    const techMatch = job.technologies && job.technologies.some(t => t.toLowerCase().includes(searchLower));

    // Check in job description for general matches
    const descriptionMatch = jobDescription.includes(searchLower);

    return companyMatch || titleMatch || techMatch || descriptionMatch;
  };

  // Get unique companies from jobs
  const getUniqueCompanies = () => {
    const companies = new Set(
      apiJobs.map(job => job.employer_name || job.company).filter(Boolean)
    );
    return Array.from(companies).sort();
  };

  // Filter jobs based on search query using smart search
  const filteredJobs = apiJobs.filter(job => smartSearch(job, searchQuery));

  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case 'salary':
        return (b.salary_max || 0) - (a.salary_max || 0);
      case 'recent':
        return new Date(b.posted_at || new Date()) - new Date(a.posted_at || new Date());
      case 'company':
        return (a.employer_name || '').localeCompare(b.employer_name || '');
      default:
        return 0;
    }
  });

  // Dedupe and split into: Recommended (all initial API jobs) vs Other Opportunities (diverse category jobs)
  const displayJobs = dedupeJobs(sortedJobs);
  // Recommended = first N jobs from initial API search (Remotive -> Adzuna -> mock)
  // Other = jobs appended from diverse category searches
  const displayPrimary = displayJobs.slice(0, initialApiJobsCount); // All initial API results
  const displayOther = displayJobs.slice(initialApiJobsCount); // Jobs from diverse categories

  const handleWishlist = (job) => {
    const jobId = job.id || job.employer_name; // Use job ID as fallback to company name
    
    if (wishlistJobIds.has(jobId)) {
      // Remove from wishlist
      const newWishlist = new Set(wishlistJobIds);
      newWishlist.delete(jobId);
      setWishlistJobIds(newWishlist);
      onDeleteJob(jobId);
    } else {
      // Add to wishlist
      const trackedJob = convertApiJobToTrackedJob(job, 'wishlist');
      onAddJob(trackedJob);
      const newWishlist = new Set(wishlistJobIds);
      newWishlist.add(jobId);
      setWishlistJobIds(newWishlist);
    }
  };

  const handleApply = (job) => {
    // Open the job detail panel where user can select resume and apply
    onJobClick(job);
  };

  // Convert API/Mock job to tracked job format
    const convertApiJobToTrackedJob = (apiJob, status = 'wishlist') => {
      const id = apiJob.id || Date.now().toString();
  
      return {
        id: String(id),
        status,
        title: apiJob.job_title || apiJob.title || '',
        company: apiJob.employer_name || apiJob.company || '',
        salary_min: apiJob.salary_min ?? null,
        salary_max: apiJob.salary_max ?? null,
        posted_at: apiJob.posted_at || apiJob.date || null,
        description: apiJob.description || apiJob.job_description || '',
        job_apply_link: apiJob.job_apply_link || apiJob.job_url || '',
        isMockJob: !!apiJob.isMockJob,
        source: apiJob.source || apiJob.provider || null,
        raw: apiJob,
      };
    };
  
    return (
      <Box>
        {displayJobs.length > 0 ? (
          <Box>
            {/* RECOMMENDED JOBS SECTION */}
            {displayPrimary.length > 0 && (
              <Box sx={{ mb: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Recommended Jobs</Typography>
                </Box>
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' } }}>
                  {displayPrimary.map((job, index) => (
                    <Box key={`job-${index}`}>
                  <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', transition: 'all 0.3s ease', '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.12)', transform: 'translateY(-2px)' } }}>
                    <Box sx={{ p: 2, pb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: '0.95rem', lineHeight: 1.3, minHeight: 32 }}>
                        {job.job_title || job.title}
                      </Typography>
                      <Typography variant="body2" color="primary" sx={{ fontWeight: 600, mb: 1, fontSize: '0.85rem' }}>
                        {job.employer_name || job.company}
                      </Typography>

                      {!isFirstTime && !job.isMockJob && (
                        <Chip label={getStatusLabel(job.status)} size="small" sx={{ bgcolor: getStatusColor(job.status), color: 'white', fontWeight: 600, mb: 1, height: 22 }} />
                      )}

                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                        {isFirstTime && job.job_city && (
                          <Chip label={`${job.job_city}${job.job_state ? ', ' + job.job_state : ''}`} size="small" variant="outlined" sx={{ height: 22, fontSize: '0.7rem' }} />
                        )}
                        {isFirstTime && job.job_type && (
                          <Chip label={job.job_type} size="small" variant="outlined" sx={{ height: 22, fontSize: '0.7rem' }} />
                        )}
                        {!isFirstTime && job.source && (
                          <Chip label={job.source} size="small" variant="outlined" sx={{ height: 22, fontSize: '0.7rem' }} />
                        )}
                      </Box>

                      {(job.salary_max || job.salary_min) && (
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main', mb: 1, fontSize: '0.8rem' }}>
                          ${isFirstTime ? `${job.salary_min?.toLocaleString() || 'N/A'} - ${job.salary_max?.toLocaleString() || 'N/A'}` : (job.salary_max ? `${job.salary_max.toLocaleString()}+` : '')}
                        </Typography>
                      )}

                      {job.posted_at && (
                        <Typography variant="caption" sx={{ color: 'textSecondary', mb: 1, fontSize: '0.75rem', display: 'block' }}>
                          Posted {formatDistanceToNow(new Date(job.posted_at), { addSuffix: true })}
                        </Typography>
                      )}

                      {(isFirstTime ? job.job_description : job.description) && (
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1, fontSize: '0.8rem', lineHeight: 1.4, maxHeight: 48, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {isFirstTime ? job.job_description : job.description}
                        </Typography>
                      )}

                      {(job.technologies || job.keywords) && (job.technologies || job.keywords).length > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.4, flexWrap: 'wrap', mb: 1 }}>
                          {(job.technologies || job.keywords).slice(0, 3).map((skill) => (
                            <Chip key={skill} label={skill} size="small" variant="filled" sx={{ height: 20, fontSize: '0.65rem' }} />
                          ))}
                          {(job.technologies || job.keywords).length > 3 && (
                            <Chip label={`+${(job.technologies || job.keywords).length - 3}`} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                          )}
                        </Box>
                      )}

                      {isFirstTime && job.matchScore && (
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'info.main' }}>⭐ Match: {job.matchScore}%</Typography>
                      )}
                    </Box>

                    <Box sx={{ borderTop: '1px solid', borderColor: 'divider', my: 0.5 }} />

                    <Box sx={{ p: 1.5, display: 'flex', gap: 0.8, justifyContent: 'space-between' }}>
                      <Button size="small" variant={wishlistJobIds.has(job.id || job.employer_name) ? "contained" : "outlined"} onClick={() => handleWishlist(job)} sx={{ flex: 1, fontSize: '0.7rem', py: 0.5, bgcolor: wishlistJobIds.has(job.id || job.employer_name) ? 'success.main' : 'transparent' }}>{wishlistJobIds.has(job.id || job.employer_name) ? '✓ Saved' : 'Save'}</Button>
                      {job.job_apply_link ? (
                        <Button size="small" variant="contained" href={job.job_apply_link} target="_blank" rel="noopener noreferrer" component="a" sx={{ flex: 1, fontSize: '0.7rem', py: 0.5 }}>Apply Link</Button>
                      ) : (
                        <Button size="small" variant="contained" onClick={() => handleApply(job)} sx={{ flex: 1, fontSize: '0.7rem', py: 0.5 }}>Apply</Button>
                      )}
                      <Button size="small" variant="outlined" onClick={() => onJobClick(job)} sx={{ flex: 1, fontSize: '0.7rem', py: 0.5 }}>View</Button>
                    </Box>
                  </Card>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* OTHER OPPORTUNITIES SECTION - appears after recommended, with infinite scroll */}
            {displayOther.length > 0 && (
              <Box sx={{ mt: 8 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 4 }}>
                  <Box sx={{ flex: 1, height: 2, bgcolor: 'divider' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, px: 2 }}>Other Opportunities</Typography>
                  <Box sx={{ flex: 1, height: 2, bgcolor: 'divider' }} />
                </Box>

                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' } }}>
                  {displayOther.map((job, idx) => (
                    <Box key={`other-job-${idx}`}>
                      <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', transition: 'all 0.3s ease', '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.12)', transform: 'translateY(-2px)' } }}>
                        <Box sx={{ p: 2, pb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: '0.95rem', lineHeight: 1.3, minHeight: 32 }}>
                            {job.job_title || job.title}
                          </Typography>
                          <Typography variant="body2" color="primary" sx={{ fontWeight: 600, mb: 1, fontSize: '0.85rem' }}>
                            {job.employer_name || job.company}
                          </Typography>

                          {!isFirstTime && !job.isMockJob && (
                            <Chip label={getStatusLabel(job.status)} size="small" sx={{ bgcolor: getStatusColor(job.status), color: 'white', fontWeight: 600, mb: 1, height: 22 }} />
                          )}

                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                            {isFirstTime && job.job_city && (
                              <Chip label={`${job.job_city}${job.job_state ? ', ' + job.job_state : ''}`} size="small" variant="outlined" sx={{ height: 22, fontSize: '0.7rem' }} />
                            )}
                            {isFirstTime && job.job_type && (
                              <Chip label={job.job_type} size="small" variant="outlined" sx={{ height: 22, fontSize: '0.7rem' }} />
                            )}
                            {!isFirstTime && job.source && (
                              <Chip label={job.source} size="small" variant="outlined" sx={{ height: 22, fontSize: '0.7rem' }} />
                            )}
                          </Box>

                          {(job.salary_max || job.salary_min) && (
                            <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main', mb: 1, fontSize: '0.8rem' }}>
                              ${isFirstTime ? `${job.salary_min?.toLocaleString() || 'N/A'} - ${job.salary_max?.toLocaleString() || 'N/A'}` : (job.salary_max ? `${job.salary_max.toLocaleString()}+` : '')}
                            </Typography>
                          )}

                          {job.posted_at && (
                            <Typography variant="caption" sx={{ color: 'textSecondary', mb: 1, fontSize: '0.75rem', display: 'block' }}>
                              Posted {formatDistanceToNow(new Date(job.posted_at), { addSuffix: true })}
                            </Typography>
                          )}

                          {job.job_url && (
                            <Typography component="a" href={job.job_url} target="_blank" rel="noopener noreferrer" variant="caption" sx={{ color: 'primary.main', textDecoration: 'none', mb: 1, fontSize: '0.75rem', display: 'block', '&:hover': { textDecoration: 'underline' } }}>
                              View on Website →
                            </Typography>
                          )}

                          {(isFirstTime ? job.job_description : job.description) && (
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 1, fontSize: '0.8rem', lineHeight: 1.4, maxHeight: 48, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                              {isFirstTime ? job.job_description : job.description}
                            </Typography>
                          )}

                          {(job.technologies || job.keywords) && (job.technologies || job.keywords).length > 0 && (
                            <Box sx={{ display: 'flex', gap: 0.4, flexWrap: 'wrap', mb: 1 }}>
                              {(job.technologies || job.keywords).slice(0, 3).map((skill) => (
                                <Chip key={skill} label={skill} size="small" variant="filled" sx={{ height: 20, fontSize: '0.65rem' }} />
                              ))}
                              {(job.technologies || job.keywords).length > 3 && (
                                <Chip label={`+${(job.technologies || job.keywords).length - 3}`} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                              )}
                            </Box>
                          )}

                          {isFirstTime && job.matchScore && (
                            <Typography variant="caption" sx={{ fontWeight: 600, color: 'info.main' }}>⭐ Match: {job.matchScore}%</Typography>
                          )}
                        </Box>

                        <Box sx={{ borderTop: '1px solid', borderColor: 'divider', my: 0.5 }} />

                        <Box sx={{ p: 1.5, display: 'flex', gap: 0.8, justifyContent: 'space-between' }}>
                          <Button size="small" variant={wishlistJobIds.has(job.id || job.employer_name) ? "contained" : "outlined"} onClick={() => handleWishlist(job)} sx={{ flex: 1, fontSize: '0.7rem', py: 0.5, bgcolor: wishlistJobIds.has(job.id || job.employer_name) ? 'success.main' : 'transparent' }}>{wishlistJobIds.has(job.id || job.employer_name) ? '✓ Saved' : 'Save'}</Button>
                          {job.job_apply_link ? (
                            <Button size="small" variant="contained" href={job.job_apply_link} target="_blank" rel="noopener noreferrer" component="a" sx={{ flex: 1, fontSize: '0.7rem', py: 0.5 }}>Apply Link</Button>
                          ) : (
                            <Button size="small" variant="contained" onClick={() => handleApply(job)} sx={{ flex: 1, fontSize: '0.7rem', py: 0.5 }}>Apply</Button>
                          )}
                          <Button size="small" variant="outlined" onClick={() => onJobClick(job)} sx={{ flex: 1, fontSize: '0.7rem', py: 0.5 }}>View</Button>
                        </Box>
                      </Card>
                    </Box>
                  ))}
                </Box>

                {/* Load More Button - for infinite scroll paginated categories */}
                {!diverseJobsLoaded && (
                  <Box sx={{ py: 4, textAlign: 'center', mt: 4 }}>
                    {loadingMoreJobs ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={40} />
                        <Typography variant="body2" color="textSecondary">Loading more opportunities...</Typography>
                      </Box>
                    ) : (
                      <Button variant="outlined" onClick={() => fetchDiverseOtherJobs(diverseJobPage)} disabled={loadingMoreJobs}>Load More Jobs</Button>
                    )}
                  </Box>
                )}
              </Box>
            )}

            {/* LOAD MORE BUTTON - Show if no diverse jobs yet but we have recommended jobs */}
            {displayOther.length === 0 && displayPrimary.length > 0 && !diverseJobsLoaded && (
              <Box sx={{ mt: 8 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 4 }}>
                  <Box sx={{ flex: 1, height: 2, bgcolor: 'divider' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, px: 2 }}>Other Opportunities</Typography>
                  <Box sx={{ flex: 1, height: 2, bgcolor: 'divider' }} />
                </Box>
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ mb: 2, color: 'textSecondary' }}>Want to see more opportunities from different categories?</Typography>
                  {loadingMoreJobs ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                      <CircularProgress size={20} />
                      <Typography variant="body2" color="textSecondary">Loading more opportunities...</Typography>
                    </Box>
                  ) : (
                    <Button variant="contained" onClick={() => fetchDiverseOtherJobs(0)} disabled={loadingMoreJobs}>Load Other Opportunities</Button>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="textSecondary">
              {isFirstTime ? 'No opportunities found. Update your profile to see more options.' : 'No jobs match your search.'}
            </Typography>
          </Paper>
        )}
      </Box>
    );
  }

  export default AllJobsView;
