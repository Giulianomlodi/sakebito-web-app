import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useChainId } from 'wagmi';
import MintButton from '../web3/MintButton';
import MoonPayButton from '../web3/MoonPayButton';
import styles from '../../src/styles/hero.module.css';

const Hero: React.FC = () => {
    const [useMoonPay, setUseMoonPay] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const chainId = useChainId();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    const isTestnet = process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true';
    const contractAddress = isTestnet
        ? process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_SEPOLIA
        : process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MAINNET;
    const moonpayApiKey = process.env.NEXT_PUBLIC_MOONPAY_API_KEY;
    const moonpayUrl = isTestnet
        ? process.env.NEXT_PUBLIC_MOONPAY_TEST_URL
        : process.env.NEXT_PUBLIC_MOONPAY_LIVE_URL;

    if (!contractAddress || !moonpayApiKey || !moonpayUrl) {
        console.error('Contract address, MoonPay API key, or MoonPay URL is not set');
        return null;
    }

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
                    <Image
                        className={styles.imageSake}
                        src="/sakeIMG.jpg"
                        alt="Sake Logo"
                        width={400}
                        height={400}
                    />
                    <div className={styles.introSake}>
                        <Image
                            src="/SAKEbito_name_black.png"
                            alt="SAKEbito Logo"
                            width={180}
                            height={39}
                        />
                        <p>Secure your exclusive access to Japan's <strong>hidden sake gems.</strong></p>
                        <p>Only <strong>100</strong> SAKEbito NFTs available for each edition. Price progressively increases. Mint yours before they're gone!</p>
                    </div>
                    <div className={styles.mintOptions}>
                        <div className={styles.mintToggle}>
                            <button
                                className={!useMoonPay ? styles.activeToggle : ''}
                                onClick={() => setUseMoonPay(false)}
                            >
                                Web3 Mint
                            </button>
                            <button
                                className={useMoonPay ? styles.activeToggle : ''}
                                onClick={() => setUseMoonPay(true)}
                            >
                                Pay with FIAT
                            </button>
                        </div>
                        {useMoonPay ? (
                            <MoonPayButton
                                isTestnet={isTestnet}
                                contractAddress={contractAddress as `0x${string}`}
                                apiKey={moonpayApiKey}
                                moonpayUrl={moonpayUrl}
                            />
                        ) : (
                            <MintButton
                                contractAddress={contractAddress as `0x${string}`}
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;