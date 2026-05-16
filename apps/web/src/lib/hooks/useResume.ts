import type { IApiResponse } from "../types/api";
import type { IResume } from "../types/resume";

// Hardcoded until backend is deployed — data mirrors resume_rows.sql + portfolio_content_rows.sql
const RESUME: IResume = {
  pdfUrl:
    "https://coxuudggtdspnlgyumwu.supabase.co/storage/v1/object/public/files/resumes/resume-1778257133598212000.pdf",
  updatedAt: "2026-05-11T15:16:10.835322+00:00",
  experience: [
    {
      id: "exp-1",
      title: "Front End Developer",
      organization: "Rekosistem",
      location: "Jakarta, Indonesia",
      startDate: "10/2023",
      description:
        "Develop and maintain ongoing projects using React.js and React Native. Work on ERP system development and state management optimization.",
      highlights: [
        "Develop and maintain 9+ ongoing projects using React.js and React Native",
        "Develop and enhance ERP system to optimize internal business processes",
        "Implement state management using Redux, MobX, and Zustand for efficient data flow",
        "Optimize CI/CD pipelines, automating deployments, APK builds, and testing workflows",
        "Write unit tests with Jest to ensure application stability",
      ],
    },
    {
      id: "exp-2",
      title: "Mobile Developer",
      organization: "PT. Extramarks Education Indonesia (Kelas Pintar)",
      location: "Jakarta, Indonesia",
      startDate: "04/2023",
      endDate: "09/2024",
      description:
        "Developed React Native revamp project for Kelas Pintar App using TypeScript.",
      highlights: [
        "Developed React Native revamp project for Kelas Pintar App using TypeScript",
        "Built reusable components and optimized state management with Redux",
        "Ensured project delivery within 3-month deployment timeline",
      ],
    },
    {
      id: "exp-3",
      title: "Full Stack Developer",
      organization: "PT Nawa Data Solutions",
      location: "South Tangerang, Banten",
      startDate: "10/2022",
      endDate: "03/2023",
      description:
        "Worked as Full Stack Developer in Research and Development Division, under Nawa Framework & Digital Enabler Department.",
      highlights: [
        "Developed Nawadata's internal framework using React.js, .NET Core, and React Native",
        "Implemented backend CRUD API using .NET Core",
      ],
    },
    {
      id: "exp-4",
      title: "IT Support",
      organization: "AIA Group Limited",
      location: "South Jakarta, Jakarta",
      startDate: "12/2021",
      endDate: "03/2022",
      description:
        "Provided IT support including network configuration and documentation.",
      highlights: [
        "Configuring Networking using Mikrotik Router and Cisco Switch",
        "Configuring Domain and VPN",
        "Troubleshooting problematic computer systems or network components",
        "Respond to all inquiries and requests in a timely manner",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      title: "System Information (S1)",
      organization: "Universitas Gunadarma",
      location: "Bekasi, Jawa Barat",
      startDate: "2018",
      endDate: "12/2022",
      description:
        "Bachelor's degree in Information Systems with strong academic performance.",
      highlights: [
        "Cumulative GPA: 3.77 / 4.0",
        "2019 Runner-Up Fast Correct Category in Unlimited Software Building Contest",
      ],
    },
    {
      id: "edu-2",
      title: "React Native Developer Bootcamp",
      organization: "Binar Academy",
      location: "Jakarta, Indonesia",
      startDate: "08/2022",
      endDate: "08/2022",
      description: "Intensive bootcamp focused on React Native development.",
      highlights: [
        "Completed React Native Developer Bootcamp, mastering Redux Thunk, Jest, ESLint, and CI/CD",
        "Built a SecondHand Marketplace App as a final project",
      ],
    },
  ],
  skills: [
    {
      category: "Frontend",
      skills: [
        "React",
        "React Native",
        "TypeScript",
        "JavaScript",
        "Next.js",
        "Expo",
      ],
    },
    {
      category: "State Management",
      skills: ["Redux", "Redux Thunk", "MobX", "Zustand", "React Hook Form"],
    },
    {
      category: "Mobile",
      skills: ["React Native", "Expo", "React Native Web", "PWA", "Firebase"],
    },
    {
      category: "Backend & Tools",
      skills: ["Node.js", ".NET Core", "C#", "PHP", "MySQL", "CI/CD", "Golang"],
    },
    {
      category: "UI Libraries",
      skills: ["Chakra UI", "React Native Paper", "Tamagui", "Tailwind CSS"],
    },
  ],
};

export function useResume() {
  return {
    data: {
      success: true,
      data: RESUME,
      meta: undefined,
      error: undefined,
    } as IApiResponse<IResume>,
    isLoading: false,
    error: null,
  };
}
