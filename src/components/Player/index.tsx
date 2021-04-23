import React, { useContext, useEffect, useRef } from 'react';
import { PlayerContext } from '../../contexts/PlayerContext';
import Image from 'next/image';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';
import styles from './styles.module.scss';

export const Player: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);


  const { 
    episodeList, 
    currentEpisodeIndex, 
    isPlaying, 
    togglePlay,
    setPlayingState 
  } = useContext(PlayerContext);

  useEffect(() => {
    if(!audioRef.current) {
      return;
    }

    if(isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying])


  const episode = episodeList[currentEpisodeIndex];

  console.log(!episode)

  return (
    <aside className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora"/>
        <strong>Tocando agora</strong>
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
        <strong>{episode.title}</strong>
        <span>{episode.members}</span>
       </div>
      ) : (
        <div className={styles.emptyPlayer}>
         <strong>Selecione um podcast para ouvir</strong>
       </div>
     )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>00:00</span>
          <div className={styles.slider}> 
            { episode ? (
              <Slider 
                trackStyle={{ background: `linear-gradient(130.69deg, #80FFEA , #8AFF80)`}}
                railStyle={{ background: `linear-gradient(130.69deg, #9580ff , #80FFEA)`}}
                handleStyle={{ borderColor: '#80FFEA', borderWidth: 4}}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>00:00</span>
        </div>

        { episode && (
          <audio 
            src={episode.url} 
            ref={audioRef}
            autoPlay
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
          />  
        )}

        <div className={styles.buttons}>
          <button 
            type="button" 
            disabled={!episode}
          >
            <img src="/shuffle.svg" alt="Embaralhar"/>
          </button>

          <button type="button" disabled={!episode}>
            <img src="/play-previous.svg" alt="Tocar anterior"/>
          </button>

          <button type="button" 
            className={ isPlaying ? styles.playButton : styles.pauseButton }  
            disabled={!episode}  
            onClick={togglePlay}
          >

            { isPlaying 
              ? <img src="/pause.svg" alt="Tocar anterior"/>
              : <img src="/play.svg" alt="Tocar anterior"/>
            }
            
          </button>

          <button type="button" disabled={!episode}>
            <img src="/play-next.svg" alt="Tocar proxima" />
          </button>

          <button type="button" disabled={!episode}>
            <img src="/repeat.svg" alt="Tocar anterior"/>
          </button>
        </div>

      </footer>
    </aside>
  );
}

