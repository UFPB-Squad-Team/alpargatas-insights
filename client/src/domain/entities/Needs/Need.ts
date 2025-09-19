export enum NeedType {
  INFRASTRUCTURE = 'infrastructure',
  MATERIAL = 'material',
  HUMAN_RESOURCES = 'hr',
  SOCIAL_ASSISTANCE = 'social',
  OTHER = 'other',
}

export enum SubmitterType {
  STUDENT = 'student',
  TEACHER = 'teacher',
  MANAGER = 'manager',
  NGO = 'ngo',
  COMMUNITY = 'community',
  OTHER = 'other',
}

export enum NeedStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface INeed {
  id: string;
  title: string;
  description: string;
  type: NeedType;
  submitterType: SubmitterType;
  status: NeedStatus;
  createdAt?: string;
  location?: {
    type: 'school' | 'municipality';
    id: string;
    name: string;
  };
}

export type PaginatedNeedsResponse = {
  needs: INeed[];
  total: number;
  page: number;
  currentPage: number;
};
