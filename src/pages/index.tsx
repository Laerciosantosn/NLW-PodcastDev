import React from "react";
import { GetStaticProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { parseISO, format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { api } from "../services/api";

import styles from './home.module.scss';
import { usePlayer } from '../contexts/PlayerContext';
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";

// SPA useEffect e um exemplo de SPA
// SSR getServerSideProps ou getStaticProps o next ja entende que deve executar a função antes de exibir a pagina
// SSG So funciona em produção

type Episode = {
  id: string,
  title: string,
  thumbnail: string,
  members: string,
  published_at: string,
  duration: number,
  durationAsString: string;
  description: string,
  url: string,
}

type HomeProps = {
  allEpisodes: Array<Episode>
  latestEpisodes: Array<Episode>
}

export default function Home({ allEpisodes, latestEpisodes }: HomeProps) {

  const { playList } = usePlayer();

  const episodeList = [...latestEpisodes, ...allEpisodes];

  return (
    <div className={styles.homepage}>
      <Head>
        <title>Home podcast</title>
      </Head>
      <section className={styles.latestEpisodes}>
        <h2>Last releases</h2>

        <div>
          <ul>
            {latestEpisodes.map((episode, index) => {
              return (
                <li key={episode.id}>
                  <img
                    src={episode.thumbnail}
                    alt={episode.title}
                  />

                  <div className={styles.episodeDetails}>
                    <Link href={`/episodes/${episode.id}`}>
                      <a >{episode.title}</a>
                    </Link>
                    <p>{episode.members}</p>
                    <span>{episode.published_at}</span>
                    <span>{episode.durationAsString}</span>
                  </div>
                  
                  <button type="button" onClick={() => playList(episodeList, index)}>
                    <img src="/play-green.svg" alt="Tocar episódio"/>
                  </button>

                </li>
              )
            })}
          </ul>
        </div>

      </section>

      <section className={styles.allEpisodes}>
        <h2>All episodes</h2>

        <span>
          <div></div>
          <div>Podcast</div>
          <div>Members</div>
          <div>Date</div>
          <div>Duration</div>
          <div></div>
        </span>

        <article>
          {allEpisodes.map((episode, index) => {
            return (
              <div key={episode.id} className={styles.episode}>
                <img
                  src={episode.thumbnail}
                  alt={episode.title}
                />
                <Link href={`/episodes/${episode.id}`}>
                  <a>{episode.title}</a>
                </Link>
                <p>{episode.members}</p>
                <strong>{episode.published_at}</strong>
                <span>{episode.durationAsString}</span>

                <button
                  type="button"
                  onClick={() => playList(episodeList, index + latestEpisodes.length)}
                >
                  <img src="/play-white.svg" alt="Tocar episódio" />
                </button>

              </div>
            )
          })}

        </article>

        {/* <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Members</th>
              <th>Date</th>
              <th>Duration</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => {
              return (
                <tr key={episode.id}>
                  <td style={{width: 72}}>
                    <Image 
                      width={120} 
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit='cover'
                    />
                  </td>
                  <td>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{width: 100}}>{episode.published_at}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button 
                      type="button"
                      onClick={() => playList(episodeList, index + latestEpisodes.length)}
                    >
                      <img src="/play-white.svg" alt="Tocar episódio"/>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
     */}
      </section>

      <div className={styles.attribution}>
        Challenge by <a href="https://rocketseat.com.br/" target="_blank">NLW - Rocketseat.</a>.
        Coded by <a href="#">Laércio Santos</a>.
     </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      published_at: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: episode.file.duration,
      durationAsString: convertDurationToTimeString(episode.file.duration),
      description: episode.description,
      url: episode.file.url,
    }
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      allEpisodes,
      latestEpisodes
    },
    revalidate: 60 * 60 * 8,
  }
}
