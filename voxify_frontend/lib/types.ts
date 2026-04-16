export type VoicePart = "soprano" | "alto" | "tenor" | "bass";

export type UploadedMedia = {
  url: string;
  public_id: string;
};

export type ChantVoice = {
  id: string;
  name: string;
  audio: UploadedMedia;
};

export type Chant = {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  coverImage?: UploadedMedia | null;
  coverUrl?: string;
  lyrics?: string;
  audioUrl?: UploadedMedia | null;
  mainAudioUrl?: string;
  voices: ChantVoice[];
  sheetMusic?: UploadedMedia | null;
  sheetMusicUrl?: string;
  isPublished?: boolean;
  createdAt?: string;
  plays?: number;
};

export type ChantPayload = {
  title: string;
  category?: string;
  lyrics?: string;
  tags?: string[];
  isPublished?: boolean;
};

export type AuthPayload = {
  email: string;
  password: string;
  name?: string;
};

export type AuthResponse = {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token?: string;
};
