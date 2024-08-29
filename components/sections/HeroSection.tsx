import React, { useState } from 'react';
import Image from 'next/image';

import MultipleMintButton from '../web3/MultipleMintButton';
import WhitelistMintButton from '../web3/WhitelistMintButton';
import WhitelistVerifier from '../web3/WhitelistVerifier';
import styles from '../../src/styles/hero.module.css';

const Hero = () => {
    const [merkleProof, setMerkleProof] = useState<`0x${string}`[]>([]);
    const [isWhitelisted, setIsWhitelisted] = useState(false);

    const handleProofGenerated = (proof: `0x${string}`[], whitelisted: boolean) => {
        setMerkleProof(proof);
        setIsWhitelisted(whitelisted);
    };

    return (
        <section className={styles.heroSection}>
            <WhitelistVerifier onProofGenerated={handleProofGenerated} />
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
                        <p>Secure your exclusive access to Japan's <strong>hidden sake gems.</strong></p>
                        <p>Only <strong>100</strong> SAKEbito NFTs available for each batch. Price progressively increases. Mint yours before they're gone!</p>
                    </div>
                    <div className={styles.mintOptions}>
                        {isWhitelisted ? (
                            <WhitelistMintButton merkleProof={merkleProof} />
                        ) : (
                            <MultipleMintButton />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;