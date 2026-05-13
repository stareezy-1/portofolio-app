import {
  EProjectType,
  EEmulatorPlatform,
  EEmulatorOrientation,
} from "../constants/enums";

export interface IEmulatorConfig {
  expoUrl: string;
  platform: EEmulatorPlatform;
  orientation: EEmulatorOrientation;
  deviceModel?: string;
}

export interface IProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  gallery: string[];
  technologies: string[];
  type: EProjectType;
  githubUrl?: string;
  liveUrl?: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
  demoMode: boolean;
  emulatorConfig?: IEmulatorConfig;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}
