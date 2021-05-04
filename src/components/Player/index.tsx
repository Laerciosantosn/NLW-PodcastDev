import React, { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import Image from 'next/image';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';
import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export const Player: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [toggleNavigation, setToggleNavigation] = useState(true);
  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlayingState,
    skipNext,
    skipPrevious,
    hasNext,
    hasPrevious,
    clearPlayerState,
  } = usePlayer();


  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying])

  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    })
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function handleEpisodeEnd() {
    if (hasNext) {
      skipNext();
    } else {
      clearPlayerState();
    }
  }

  function handleToggleNavigation() {
    setToggleNavigation(!toggleNavigation);
  }

  const episode = episodeList[currentEpisodeIndex];

  return (
    <aside className={`${styles.playerContainer}  ${toggleNavigation === false ? styles.expand : ''}  `} >
      <header>
        {toggleNavigation ? (
          <img
            className={styles.expand}
            src="/arrow-top.svg"
            alt="Expand"
            onClick={handleToggleNavigation}
          />
        ) : (
          <img
            className={styles.expand}
            src="/arrow-bottom.svg"
            alt="Expand"
            onClick={handleToggleNavigation}
          />
        )}

        <img src="/playing.svg" alt="Playing now" />
        <strong>PLaying now</strong>
      </header>

      { episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            objectFit="cover"
            src={episode.thumbnail}
            alt={episode.title}
          />
          <div className={styles.animation}>
            <strong>{episode.title}</strong>
          </div>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Select a podcast to listen</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ background: `linear-gradient(130.69deg, #80FFEA , #8AFF80)` }}
                railStyle={{ background: `linear-gradient(130.69deg, #9580ff , #80FFEA)` }}
                handleStyle={{ borderColor: '#80FFEA', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            loop={isLooping}
            autoPlay
            onEnded={handleEpisodeEnd}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
          />
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ''}
          >
            <img src="/shuffle.svg" alt="Shuffle" />
          </button>

          <button
            type="button"
            disabled={!episode || !hasPrevious}
            onClick={skipPrevious}
          >
            <img src="/skip-previous.svg" alt="Skip previous" />
          </button>

          <button type="button"
            className={isPlaying ? styles.playButton : styles.pauseButton}
            disabled={!episode}
            onClick={togglePlay}
          >

            {isPlaying
              ? <img src="/pause.svg" alt="Pause" />
              : <img src="/play.svg" alt="Play" />
            }

          </button>

          <button
            type="button"
            disabled={!episode || !hasNext}
            onClick={skipNext}
          >
            <img src="/skip-next.svg" alt="Skip next" />
          </button>

          <button
            type="button"
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="Repeat" />
          </button>
        </div>

      </footer>
    </aside>
  );
}

