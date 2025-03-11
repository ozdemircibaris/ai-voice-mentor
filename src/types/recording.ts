export interface Recording {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description?: string;
  audioUrl: string;
  duration: number;
  type: string;
  targetAudience?: string;
  isPublic: boolean;
  userId: string;
  analyses: Analysis[];
}
