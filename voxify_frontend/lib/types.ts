export type VoicePart = "soprano" | "alto" | "tenor" | "bass";

export type UploadedMedia = {
  url: string;
  public_id: string;
};

export type Chant = {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  coverImage?: UploadedMedia | null;
  lyrics?: string;
  audioUrl?: UploadedMedia | null;
  voices?: Partial<Record<VoicePart, UploadedMedia | null>>;
  coverUrl?: string;
  mainAudioUrl?: string;
  voiceTracks?: Partial<Record<VoicePart, string>>;
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
