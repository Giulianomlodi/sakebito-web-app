import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { abi } from '../../contract-abi';
import Toast from '../layout/Toast';
import styles from '../../src/styles/MintButton.module.css';
import BatchDetails from './BatchDetails';

const CONTRACT_ADDRESS = '0x084aaf400ac39b0d36daf82852005625d7d8b009';

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
                value: parseEther('0.001'), // Adjust the value based on your contract's mint price
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
        return null; // or a loading placeholder
    }

    return (
        <div className={styles.mintWrapper}>
            <BatchDetails contractAddress={CONTRACT_ADDRESS} />
            <button
                className={styles.mintButton}
                onClick={handleMint}
                disabled={!isConnected || isPending || isConfirming}
            >
                {isPending || isConfirming ? 'Minting...' : 'Mint'}
            </button>
            {toastMessage && <Toast onClose={closeToast}>{toastMessage}</Toast>}
        </div>
    );
};

export default MintButton;