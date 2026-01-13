
export enum Language {
  Spanish = 'Spanish',
  French = 'French',
  German = 'German',
  Japanese = 'Japanese',
  Korean = 'Korean',
  Italian = 'Italian',
  Chinese = 'Chinese'
}

export interface Scenario {
  id: string;
  title: string;
  icon: string;
  description: string;
  systemInstruction: string;
}

export interface TranscriptionEntry {
  type: 'user' | 'model';
  text: string;
  timestamp: number;
}
