export interface ISocialLink {
  platform: string;
  url: string;
}

export interface ITechCategory {
  category: string;
  icon: string;
  skills: string[];
}

export interface IWorkExperience {
  id: string;
  title: string;
  organization: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description: string;
  highlights: string[];
}

export interface IEducation {
  id: string;
  title: string;
  organization: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description: string;
  highlights: string[];
}

export interface IPortfolioContent {
  id: string;
  name: string;
  role: string;
  tagline: string;
  bio: string;
  avatarUrl?: string;
  yearsOfExperience: number;
  projectsBuilt: number;
  happyClients: number;
  email: string;
  location: string;
  socialLinks: ISocialLink[];
  techStack: ITechCategory[];
  workExperience: IWorkExperience[];
  education: IEducation[];
  updatedAt: string;
}

export interface IContactMessage {
  name: string;
  email: string;
  message: string;
  projectType?: string;
  budget?: string;
}
