export interface BookmarkedBook {
  id: string;
  title: string;
  authors: string[];
  image?: string;
  minutesDescription: string;
  timeSpentSeconds?: number;
}
