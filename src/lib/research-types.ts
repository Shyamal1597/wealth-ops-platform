// Research Report Types
export type ResearchCategory = 'Fundamental' | 'Technical' | 'Economic';

export type ResearchSubcategory =
  | 'Company'
  | 'Sector'
  | 'Daily'
  | 'Weekly'
  | 'Monthly'
  | 'Sector/ Index'
  | 'Views and Events';

export interface ResearchReport {
  id: string;
  title: string;
  category: ResearchCategory;
  subcategory: ResearchSubcategory;
  secondaryCategory?: ResearchCategory;
  secondarySubcategory?: ResearchSubcategory;
  fileName: string;
  filePath: string;
  fileSize: number;
  uploadDate: string;
  reportDate?: string; // Date of the report (dd-mm-yyyy)
  analystName?: string; // Name of the analyst who prepared the report
  description?: string;
}

export const RESEARCH_STRUCTURE = {
  Fundamental: ['Company', 'Sector', 'Daily', 'Weekly', 'Monthly'],
  Technical: ['Company', 'Sector/ Index'],
  Economic: ['Views and Events']
} as const;
