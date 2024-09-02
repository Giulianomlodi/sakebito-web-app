import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { abi } from '../../contract-abi';
import Toast from '../layout/Toast';
import styles from '../../src/styles/MintButton.module.css';
import BatchDetails from './BatchDetails';

const CONTRACT_ADDRESS = '0x5ad39d7a300ac8dd1eca63f0f1837035f335ac00';

const MultipleMintButton: React.FC = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [mintAmount, setMintAmount] = useState(1);
    const { isConnected } = useAccount();
    const { writeContract, data: hash, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && isConfirmed) {
            setToastMessage(`Mint successful! Transaction hash: ${hash}`);
        }
    }, [isMounted, isConfirmed, hash]);

    const handleMint = async () => {
        try {
            writeContract({
                address: CONTRACT_ADDRESS,
                abi,
                functionName: 'mint',
                args: [BigInt(mintAmount)],
                value: parseEther((0.001 * mintAmount).toString()),
            });
        } catch (err) {
            console.error('Error minting:', err);
            setToastMessage('Error minting. Please try again.');
        }
    };

    useEffect(() => {
        if (isMounted && error) {
            setToastMessage(`Error: ${error.message}`);
        }
    }, [isMounted, error]);

    const closeToast = () => {
        setToastMessage(null);
    };

    if (!isMounted) {
        return null;
    }

    const buttonText = isPending || isConfirming ? 'Minting...' : 'Mint';

    return (
        <div className={styles.mintWrapper}>
            <BatchDetails contractAddress={CONTRACT_ADDRESS} />
            {isConnected ? (
                <>
                    <div className={styles.mintAmountSelector}>
                        <button onClick={() => setMintAmount(Math.max(1, mintAmount - 1))}>-</button>
                        <span>{mintAmount}</span>
                        <button onClick={() => setMintAmount(Math.min(3, mintAmount + 1))}>+</button>
                    </div>
                    <button
                        className={styles.mintButton}
                        onClick={handleMint}
                        disabled={isPending || isConfirming}
                    >
                        {buttonText} {mintAmount} SAKEbito
                    </button>
                </>
            ) : (
                <ConnectButton />
            )}
            {toastMessage && <Toast onClose={closeToast}>{toastMessage}</Toast>}
        </div>
    );
};

export default MultipleMintButton;