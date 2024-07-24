import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Header from '../../components/layout/Header';
import Hero from '@/components/sections/HeroSection';
import MobileProfile from '@/components/layout/MobileProfile';
import Footer from '@/components/layout/Footer';

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

      <Footer />
    </div>
  );
};

export default Home;