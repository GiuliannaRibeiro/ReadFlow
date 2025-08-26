export interface Book {
  id: string;
  title: string;
  authors: string[];
  image?: string;
  minutesDescription: string;
  timeSpentSeconds?: number;
}
