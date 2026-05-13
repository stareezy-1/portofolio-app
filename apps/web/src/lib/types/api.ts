import { EErrorCode, EProjectType } from "../constants/enums";
import { IEmulatorConfig } from "./project";

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IApiError {
  code: EErrorCode;
  message: string;
  fields?: Record<string, string>;
}

export interface IApiResponse<T> {
  success: boolean;
  data: T;
  meta?: IPaginationMeta;
  error?: IApiError;
}

export interface IProjectCreateInput {
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  gallery?: string[];
  technologies: string[];
  type: EProjectType;
  githubUrl?: string;
  liveUrl?: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
  demoMode?: boolean;
  emulatorConfig?: IEmulatorConfig;
  featured?: boolean;
}

export type IProjectUpdateInput = Partial<IProjectCreateInput>;
