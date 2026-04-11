export type ChantMedia = {
    url: string;
    public_id: string;
};

export type ChantVoices = {
    soprano?: ChantMedia;
    alto?: ChantMedia;
    tenor?: ChantMedia;
    bass?: ChantMedia;
};

export type CreateChantData = {
    title: string;
    category?: string;
    lyrics?: string;
    tags?: string[];
    isPublished?: boolean;

    coverImage?: ChantMedia;
    audioUrl?: ChantMedia;
    voices?: ChantVoices;
};