import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Header from '../../components/layout/Header';
import Hero from '@/components/sections/HeroSection';
import MobileProfile from '@/components/layout/MobileProfile';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>SAKEbito - Web App</title>
        <meta
          content="A web app for SAKEbito"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <Header />
        <Hero />
        <MobileProfile />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          All rights reserved - © 2024 - SAKEbito
        </div>
        <div className={styles.footerRight}>
          <a href="https://x.com/otakun_0x" rel="noopener noreferrer" target="_blank">
            Made with ❤️ by your fren otakun_0x
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Home;