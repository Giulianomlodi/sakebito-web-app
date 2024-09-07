import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { abi } from '../../contract-abi';
import Toast from '../layout/Toast';
import styles from '../../src/styles/MintButton.module.css';
import BatchDetails from './BatchDetails';

const CONTRACT_ADDRESS = '0x60190a2ad63e19e301a579b18d6ec7c13979a037';

const MintButton: React.FC = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const { isConnected } = useAccount();
    const { writeContract, data: hash, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, data: receipt } = useWaitForTransactionReceipt({
        hash,
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && receipt) {
            setToastMessage(`Mint successful! Transaction hash: ${receipt.transactionHash}`);
        }
    }, [isMounted, receipt]);

    const handleMint = async () => {
        try {
            writeContract({
                address: CONTRACT_ADDRESS,
                abi,
                functionName: 'mint',
                args: [BigInt(1)],
                value: parseEther('0.14'), // Adjust the value based on your contract's mint price
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
        return null; // Return null during SSR to avoid hydration mismatch
    }

    const buttonText = isPending || isConfirming ? 'Minting...' : 'Mint';

    return (
        <div className={styles.mintWrapper}>
            <BatchDetails contractAddress={CONTRACT_ADDRESS} />
            {isConnected ? (
                <button
                    className={styles.mintButton}
                    onClick={handleMint}
                    disabled={isPending || isConfirming}
                >
                    {buttonText}
                </button>
            ) : (
                <ConnectButton />
            )}
            {toastMessage && <Toast onClose={closeToast}>{toastMessage}</Toast>}
        </div>
    );
};

export default MintButton;