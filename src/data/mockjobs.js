// src/data/mockJobs.js

export const mockJobs = [
  {
    id: 1,
    company: 'Google',
    title: 'Senior Frontend Developer',
    location: 'Mountain View, CA',
    status: 'interviewing',
    priority: 5,
    source: 'LinkedIn',
    url: 'https://linkedin.com/jobs/view/123',
    appliedDate: '2024-12-20',
    nextActionDate: '2024-12-27',
    description: 'Build next-generation web applications...',
    keywords: ['React', 'TypeScript', 'Next.js', 'System Design'],
    contacts: [
      {
        id: 1,
        name: 'Sarah Chen',
        role: 'Recruiter',
        email: 'sarah.chen@google.com',
        linkedin: 'https://linkedin.com/in/sarahchen'
      }
    ],
    notes: 'Great culture fit. Team uses React + GraphQL.',
    timeline: [
      { date: '2024-12-20', event: 'Applied', type: 'application' },
      { date: '2024-12-22', event: 'Phone screen scheduled', type: 'interview' }
    ]
  },
  {
    id: 2,
    company: 'Meta',
    title: 'Software Engineer, Frontend',
    location: 'Menlo Park, CA',
    status: 'applied',
    priority: 4,
    source: 'Company Website',
    url: 'https://metacareers.com/jobs/123',
    appliedDate: '2024-12-18',
    nextActionDate: '2024-12-28',
    description: 'Work on React-based products...',
    keywords: ['React', 'JavaScript', 'CSS', 'Performance'],
    contacts: [],
    notes: '',
    timeline: [
      { date: '2024-12-18', event: 'Applied', type: 'application' }
    ]
  },
  {
    id: 3,
    company: 'Apple',
    title: 'UI Engineer',
    location: 'Cupertino, CA',
    status: 'wishlist',
    priority: 5,
    source: 'LinkedIn',
    url: 'https://jobs.apple.com/123',
    appliedDate: null,
    nextActionDate: null,
    description: 'Create beautiful user interfaces...',
    keywords: ['SwiftUI', 'React', 'Design Systems'],
    contacts: [],
    notes: 'Waiting for referral from John.',
    timeline: [
      { date: '2024-12-15', event: 'Job saved', type: 'saved' }
    ]
  },
  {
    id: 4,
    company: 'Netflix',
    title: 'Senior Frontend Engineer',
    location: 'Los Gatos, CA',
    status: 'offer',
    priority: 5,
    source: 'Referral',
    url: 'https://jobs.netflix.com/123',
    appliedDate: '2024-11-25',
    nextActionDate: '2024-12-26',
    description: 'Build streaming experiences...',
    keywords: ['React', 'Node.js', 'GraphQL', 'Streaming'],
    contacts: [
      {
        id: 2,
        name: 'Mike Johnson',
        role: 'Hiring Manager',
        email: 'mike.j@netflix.com',
        linkedin: 'https://linkedin.com/in/mikej'
      }
    ],
    notes: 'Strong offer! Need to decide by Dec 26.',
    timeline: [
      { date: '2024-11-25', event: 'Applied', type: 'application' },
      { date: '2024-12-01', event: 'Phone screen', type: 'interview' },
      { date: '2024-12-08', event: 'Technical interview', type: 'interview' },
      { date: '2024-12-15', event: 'Offer received', type: 'offer' }
    ]
  },
  {
    id: 5,
    company: 'Spotify',
    title: 'Frontend Developer',
    location: 'New York, NY',
    status: 'applied',
    priority: 3,
    source: 'Indeed',
    url: 'https://spotify.com/jobs/123',
    appliedDate: '2024-12-19',
    nextActionDate: null,
    description: 'Work on music streaming UI...',
    keywords: ['React', 'TypeScript', 'Audio APIs'],
    contacts: [],
    notes: '',
    timeline: [
      { date: '2024-12-19', event: 'Applied', type: 'application' }
    ]
  },
  {
    id: 6,
    company: 'Shopify',
    title: 'Frontend Engineer',
    location: 'Remote',
    status: 'wishlist',
    priority: 4,
    source: 'LinkedIn',
    url: 'https://shopify.com/careers/123',
    appliedDate: null,
    nextActionDate: null,
    description: 'Build e-commerce solutions...',
    keywords: ['React', 'Ruby', 'E-commerce', 'Remote'],
    contacts: [],
    notes: 'Remote position - very interested!',
    timeline: [
      { date: '2024-12-17', event: 'Job saved', type: 'saved' }
    ]
  },
  {
    id: 7,
    company: 'Amazon',
    title: 'Frontend Engineer II',
    location: 'Seattle, WA',
    status: 'rejected',
    priority: 3,
    source: 'Company Website',
    url: 'https://amazon.jobs/123',
    appliedDate: '2024-12-01',
    nextActionDate: null,
    description: 'Build AWS console interfaces...',
    keywords: ['React', 'AWS', 'TypeScript'],
    contacts: [],
    notes: 'Not a good culture fit based on interviews.',
    timeline: [
      { date: '2024-12-01', event: 'Applied', type: 'application' },
      { date: '2024-12-10', event: 'Phone screen', type: 'interview' },
      { date: '2024-12-18', event: 'Rejected', type: 'rejected' }
    ]
  }
];

// Status options for dropdown
export const statusOptions = [
  { value: 'wishlist', label: 'Wishlist', color: '#94a3b8' },
  { value: 'applied', label: 'Applied', color: '#3b82f6' },
  { value: 'interviewing', label: 'Interviewing', color: '#f59e0b' },
  { value: 'offer', label: 'Offer', color: '#10b981' },
  { value: 'rejected', label: 'Rejected', color: '#ef4444' }
];

// Source platforms
export const sourceOptions = [
  'LinkedIn',
  'Indeed',
  'Company Website',
  'Referral',
  'Glassdoor',
  'AngelList',
  'Other'
];