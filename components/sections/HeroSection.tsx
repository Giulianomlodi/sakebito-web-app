import React from 'react';
import Image from 'next/image';
import MintButton from '../web3/UnifiedMintButton';
import styles from '../../src/styles/hero.module.css';

const Hero = () => {
    return (
        <section className={styles.heroSection}>
            <div className={styles.heroContainer}>
                <div className={styles.imageColumn}>
                    <video
                        src="/video/NFT.mp4"
                        className={styles.heroVideo}
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                </div>
                <div className={styles.contentColumn}>
                    <Image className={styles.imageSake} src="/sakeIMG.jpg" alt="Sake Logo" width={400} height={400} />
                    <div className={styles.introSake}>
                        <Image src="/SAKEbito_name_black.png" alt="SAKEbito Logo" width={180} height={39} />
                        <p>This is the Edition 1 Membership " 一級 ", with only <strong>100 seats</strong> available.</p>
                        <p> <strong>Join us</strong> now for an awesome <strong>Sake vibe</strong> and let's dive deeper into the world of <strong>premium</strong> Sake together!</p>
                    </div>
                    <div className={styles.mintOptions}>
                        <MintButton />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;