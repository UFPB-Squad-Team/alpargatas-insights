export enum FeedbackType {
  BUG = 'bug',
  SUGGESTION = 'suggestion',
  PRAISE = 'praise',
  OTHER = 'other',
}

export enum FeedbackStatus {
  NEW = 'new',
  VIEWED = 'viewed',
  IN_PROGRESS = 'in-progress',
  RESOLVED = 'resolved',
}

export interface IFeedback {
  id?: string;
  message: string;
  type: FeedbackType;
  page?: string;
  status: FeedbackStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
