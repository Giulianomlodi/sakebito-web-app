import React from 'react';
import Image from 'next/image';
import MintButton from '../web3/MintButton';
import styles from '../../src/styles/hero.module.css';

const Hero = () => {
    return (
        <section className={styles.heroSection}>
            <div className={styles.heroContainer}>
                <div className={styles.imageColumn}>
                    <Image
                        src="/sakeIMG.jpg"
                        alt="Hero Image"
                        layout="fill"
                        objectFit="cover"
                        className={styles.heroImage}
                    />
                </div>
                <div className={styles.contentColumn}>
                    <Image className={styles.imageSake} src="/sakeIMG.jpg" alt="Sake Logo" width={400} height={400} />
                    <div className={styles.introSake}>

                        <Image src="/SAKEbito_name_black.png" alt="SAKEbito Logo" width={180} height={39} />
                        <p>Secure your exclusive access to Japan's  <strong>hidden sake gems.</strong></p>
                        <p>Only <strong>100</strong> SAKEbito NFTs available for each batch. Price progressively increase. Mint yours before they're gone!</p>
                    </div>
                    <MintButton />
                </div>
            </div>
        </section>
    );
};

export default Hero;