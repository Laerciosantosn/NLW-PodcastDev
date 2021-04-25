import { createContext, ReactNode, useState, useContext } from 'react';

type EpisodePlayer = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  durationAsString: string;
  url: string;
}

type PlayerContextData = {
  episodeList: Array<EpisodePlayer>;
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  play: (episode: EpisodePlayer) => void;
  playList: (list: EpisodePlayer[], index: number) => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  setPlayingState: (state: boolean) => void;
  skipNext: () => void;
  skipPrevious: () => void;
  clearPlayerState: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
};

type PlayerContextProviderProps = {
  children: ReactNode;
}

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIhShuffling] = useState(false);

  function play(episode: EpisodePlayer) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: EpisodePlayer[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toggleLoop() {
    setIsLooping(!isLooping);
  }

  function toggleShuffle() {
    setIhShuffling(!isShuffling);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  function clearPlayerState () {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || (currentEpisodeIndex  + 1) < episodeList.length;

  function skipNext () {
   if(isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)

      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
   }else  if(hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex  + 1);
    }
  }

  function skipPrevious () {
    if(hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }

  return (

    <PlayerContext.Provider value={{
      episodeList,
      currentEpisodeIndex,
      play,
      isPlaying,
      isLooping,
      isShuffling,
      playList,
      togglePlay,
      toggleLoop,
      toggleShuffle,
      setPlayingState,
      skipNext,
      skipPrevious,
      hasNext,
      hasPrevious,
      clearPlayerState,
    }}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext);
}