import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { abi } from '../../contract-abi';
import Toast from '../layout/Toast';
import styles from '../../src/styles/MintButton.module.css';
import BatchDetails from './BatchDetails';

const CONTRACT_ADDRESS = '0x8c3343fbe076d8d33059265710a56f894207bb14';

interface WhitelistMintButtonProps {
    merkleProof: `0x${string}`[];
}

const WhitelistMintButton: React.FC<WhitelistMintButtonProps> = ({ merkleProof }) => {
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
            setToastMessage(`Whitelist mint successful! Transaction hash: ${receipt.transactionHash}`);
        }
    }, [isMounted, receipt]);

    const handleWhitelistMint = async () => {
        try {
            writeContract({
                address: CONTRACT_ADDRESS,
                abi,
                functionName: 'whitelistMint',
                args: [merkleProof],
                value: parseEther('0.00085'), // 15% discount from 0.001 ETH
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

    const buttonText = isPending || isConfirming ? 'Minting...' : 'Whitelist Mint';

    return (
        <div className={styles.mintWrapper}>
            <BatchDetails contractAddress={CONTRACT_ADDRESS} />
            {isConnected ? (
                <button
                    className={styles.mintButton}
                    onClick={handleWhitelistMint}
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

export default WhitelistMintButton;