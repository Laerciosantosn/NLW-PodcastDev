import React, { useEffect } from "react";
// SPA useEffect e um exemplo de SPA
// SSR getServerSideProps ou getStaticProps o next ja entende que deve executar a função antes de exibir a pagina
// SSG So funciona em produção

export default function Home() {

  return (
    <>
      <h1>Index</h1>
    </>
  )
}

export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes');
  const data = await response.json();

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 *60 * 8,
  }
}
