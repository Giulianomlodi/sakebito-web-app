import React, { useState, useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';
import styles from '../../src/styles/MintButton.module.css';
import BatchDetails from './BatchDetails';

interface MoonPayButtonProps {
    isTestnet: boolean;
    contractAddress: `0x${string}`;
    apiKey: string;
    moonpayUrl: string;
}

const MoonPayButton: React.FC<MoonPayButtonProps> = ({ isTestnet, contractAddress, apiKey, moonpayUrl }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const { address } = useAccount();
    const chainId = useChainId();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleMoonPayCheckout = async () => {
        if (!address) {
            alert('Please connect your wallet first');
            return;
        }

        if (chainId !== (isTestnet ? 11155111 : 1)) {
            alert(`Please switch to ${isTestnet ? 'Sepolia testnet' : 'Ethereum mainnet'}`);
            return;
        }

        const url = new URL(moonpayUrl);
        url.searchParams.append('apiKey', apiKey);
        url.searchParams.append('contractAddress', contractAddress);
        url.searchParams.append('tokenId', '_0');
        url.searchParams.append('walletAddress', address);
        url.searchParams.append('quantity', quantity.toString());
        url.searchParams.append('externalTransactionId', `tx_${Date.now()}`);
        url.searchParams.append('baseCurrencyCode', 'usd');
        url.searchParams.append('dynamicAssetInfo', 'true');

        const metadata = JSON.stringify({ customData: 'example' });
        url.searchParams.append('metadata', metadata);

        try {
            // Fetch the signature from your server
            const response = await fetch(`/api/generate-moonpay-signature?url=${encodeURIComponent(url.toString())}`);
            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            url.searchParams.append('signature', data.signature);

            // Open MoonPay checkout in a new window
            window.open(url.toString(), '_blank');
        } catch (error) {
            console.error('Error generating signature:', error);
            alert('Failed to generate signature for MoonPay checkout');
        }
    };

    if (!isMounted) {
        return null;
    }

    return (
        <div className={styles.mintWrapper}>
            <BatchDetails contractAddress={contractAddress} />
            <div className={styles.mintAmountSelector}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(3, quantity + 1))}>+</button>
            </div>
            <button
                className={styles.mintButton}
                onClick={handleMoonPayCheckout}
            >
                Buy with MoonPay
            </button>
        </div>
    );
};

export default MoonPayButton;