import { createContext } from 'react';

type EpisodePlayer = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

type PlayerContextData = {
  episodeList: Array<EpisodePlayer>;
  currentEpisodeIndex: number;
  isPlaying: boolean;
  play: (episode: EpisodePlayer) => void;
  togglePlay: () => void;
  setPlayingState: (state: boolean) => void;

};

export const PlayerContext = createContext({} as PlayerContextData);