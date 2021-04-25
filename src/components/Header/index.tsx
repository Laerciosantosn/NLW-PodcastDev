import React from 'react';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';

import styles from './styles.module.scss';

export const Header: React.FC = () => {
  const currentDate = format(new Date(), 'EEEEEE, d MMM');

  return (
    <header className={styles.headerContainer}>
        <img src="/Flat.svg" alt="Logo"/>
        <strong>PodecastDev</strong>
        {/* <p>The best for you to hear, always</p>
        <span>{currentDate}</span> */}
    </header>
  );
}