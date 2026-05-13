export interface ITimelineItem {
  id: string;
  title: string;
  organization: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description: string;
  highlights: string[];
}

export interface ISkillCategory {
  category: string;
  skills: string[];
}

export interface IResume {
  experience: ITimelineItem[];
  education: ITimelineItem[];
  skills: ISkillCategory[];
  pdfUrl?: string;
  updatedAt: string;
}
