import type { Playlist, User, Video } from "@prisma/client";

export interface UserProps {
  id: string;
  username: string;
  image: string;
}

export interface VideoWithUser extends Video {
  user: User;
}
export interface PlaylistWithUser extends Playlist {
  user: User;
  videos: VideoWithUser[];
}

export interface PlaylistWithVideos extends Playlist {
  videos: VideoWithUser[];
}
export interface UserWithVideosAndPlaylists extends User {
  videos: Video[];
  playlists: PlaylistWithVideos[];
}

export interface SearchResult {
  id: string;
  label: string;
  image: string;
  user: User | null;
}
