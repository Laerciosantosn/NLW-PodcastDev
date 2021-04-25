import React from 'react';
import format from 'date-fns/format';

import styles from './styles.module.scss';

export const Header: React.FC = () => {
  const currentDate = format(new Date(), 'EEEEEE, d MMM');

  return (
    <header className={styles.headerContainer}>
      <div>
        <img src="/Flat.svg" alt="Logo"/>
        <strong>PodecastDev</strong>

      </div>
      
        <p>The best for you to hear, always</p>
        <span>{currentDate}</span>
    </header>
  );
}