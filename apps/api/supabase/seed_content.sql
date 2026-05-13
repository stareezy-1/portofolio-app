-- Update portfolio_content with Muhammad Bintang Al Akbar's resume
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/_/sql

UPDATE portfolio_content SET
  name = 'Muhammad Bintang Al Akbar',
  role = 'Front-End Developer & Mobile Engineer',
  tagline = 'Building modern web and mobile applications with React & React Native.',
  bio = 'Motivated and detail-oriented Front-End Developer with 2+ years of experience specializing in React and React Native development. Graduated with a degree in Information Systems from Gunadarma University (GPA: 3.77/4.00). Proficient in developing web and mobile applications, implementing state management (Redux, MobX, Zustand), and optimizing CI/CD pipelines for automated deployment.',
  email = 'bintangmuhammad12@gmail.com',
  location = 'South Tangerang, Banten',
  years_of_experience = 2,
  projects_built = 9,
  happy_clients = 3,
  social_links = '[
    {"platform":"github","url":"https://github.com"},
    {"platform":"linkedin","url":"https://linkedin.com"},
    {"platform":"email","url":"mailto:bintangmuhammad12@gmail.com"}
  ]'::jsonb,
  tech_stack = '[
    {
      "category": "Frontend",
      "icon": "🎨",
      "skills": ["React", "React Native", "TypeScript", "JavaScript", "Next.js", "Expo"]
    },
    {
      "category": "State Management",
      "icon": "⚙️",
      "skills": ["Redux", "Redux Thunk", "MobX", "Zustand", "React Hook"]
    },
    {
      "category": "Mobile",
      "icon": "📱",
      "skills": ["React Native", "Expo", "React Native Web", "PWA", "Firebase"]
    },
    {
      "category": "Backend & Tools",
      "icon": "🛠️",
      "skills": ["Node.js", ".NET Core", "C#", "PHP", "MySQL", "SQL Server", "CI/CD", "GitHub", "Jest", "ESLint"]
    },
    {
      "category": "UI Libraries",
      "icon": "🎯",
      "skills": ["Chakra UI", "React Native Paper", "Tamagui"]
    }
  ]'::jsonb,
  work_experience = '[
    {
      "id": "exp-1",
      "title": "Front End Developer",
      "organization": "Rekosistem",
      "location": "Jakarta, Indonesia",
      "startDate": "10/2023",
      "description": "Develop and maintain ongoing projects using React.js and React Native. Work on ERP system development and state management optimization.",
      "highlights": [
        "Develop and maintain 9+ ongoing projects using React.js and React Native",
        "Develop and enhance ERP system to optimize internal business processes",
        "Implement state management using Redux, MobX, and Zustand for efficient data flow",
        "Optimize CI/CD pipelines, automating deployments, APK builds, and testing workflows",
        "Write unit tests with Jest to ensure application stability"
      ]
    },
    {
      "id": "exp-2",
      "title": "Mobile Developer",
      "organization": "PT. Extramarks Education Indonesia (Kelas Pintar)",
      "location": "Jakarta, Indonesia",
      "startDate": "04/2023",
      "endDate": "09/2024",
      "description": "Developed React Native revamp project for Kelas Pintar App using TypeScript.",
      "highlights": [
        "Developed React Native revamp project for Kelas Pintar App using TypeScript",
        "Built reusable components and optimized state management with Redux",
        "Ensured project delivery within 3-month deployment timeline"
      ]
    },
    {
      "id": "exp-3",
      "title": "Full Stack Developer",
      "organization": "PT Nawa Data Solutions",
      "location": "South Tangerang, Banten",
      "startDate": "10/2022",
      "endDate": "03/2023",
      "description": "Worked as Full Stack Developer in Research and Development Division, under Nawa Framework & Digital Enabler Department.",
      "highlights": [
        "Developed Nawadata''s internal framework using React.js, .NET Core, and React Native",
        "Implemented backend CRUD API using .NET Core"
      ]
    },
    {
      "id": "exp-4",
      "title": "IT Support",
      "organization": "AIA Group Limited",
      "location": "South Jakarta, Jakarta",
      "startDate": "12/2021",
      "endDate": "03/2022",
      "description": "Provided IT support including network configuration and documentation.",
      "highlights": [
        "Configuring Networking using Mikrotik Router and Cisco Switch",
        "Configuring Domain and VPN",
        "Troubleshooting problematic computer systems or network components",
        "Develop design documents, user guides, maintenance documents, and release documents",
        "Respond to all inquiries and requests in a timely manner"
      ]
    }
  ]'::jsonb,
  education = '[
    {
      "id": "edu-1",
      "title": "System Information (S1)",
      "organization": "Universitas Gunadarma",
      "location": "Bekasi, Jawa Barat",
      "startDate": "2018",
      "endDate": "12/2022",
      "description": "Bachelor''s degree in Information Systems with strong academic performance.",
      "highlights": [
        "Cumulative GPA: 3.77 / 4.0",
        "2019 Runner-Up Fast Correct Category in Unlimited Software Building Contest"
      ]
    },
    {
      "id": "edu-2",
      "title": "React Native Developer Bootcamp",
      "organization": "Binar Academy",
      "location": "Jakarta, Indonesia",
      "startDate": "08/2022",
      "endDate": "08/2022",
      "description": "Intensive bootcamp focused on React Native development.",
      "highlights": [
        "Completed React Native Developer Bootcamp, mastering Redux Thunk, Jest, ESLint, and CI/CD",
        "Built a SecondHand Marketplace App as a final project"
      ]
    }
  ]'::jsonb,
  updated_at = NOW()
WHERE id = (SELECT id FROM portfolio_content LIMIT 1);
