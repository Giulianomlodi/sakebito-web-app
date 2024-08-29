import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { abi } from '../../contract-abi';
import Toast from '../layout/Toast';
import styles from '../../src/styles/MintButton.module.css';
import BatchDetails from './BatchDetails';
import { useWhitelistStatus } from './useWhitelistStatus';

const CONTRACT_ADDRESS = '0xd08083c312cc177ea18a854c38f5bbf666638610';

const MintButton: React.FC = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [mintAmount, setMintAmount] = useState(1);
    const { address, isConnected } = useAccount();
    const { isWhitelisted, merkleProof } = useWhitelistStatus(address);
    const [hasClaimedWhitelist, setHasClaimedWhitelist] = useState(false);

    const { writeContract, data: hash, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    // Check if the user has already claimed their whitelist mint
    const { data: whitelistClaimed } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'whitelistClaimed',
        args: address ? [address] : undefined
    });

    useEffect(() => {
        setIsMounted(true);
        if (whitelistClaimed !== undefined) {
            setHasClaimedWhitelist(whitelistClaimed as boolean);
        }
    }, [whitelistClaimed]);

    useEffect(() => {
        if (isMounted && isConfirmed) {
            setToastMessage(`Mint successful! Transaction hash: ${hash}`);
            if (isWhitelisted && !hasClaimedWhitelist) {
                setHasClaimedWhitelist(true);
            }
        }
    }, [isMounted, isConfirmed, hash, isWhitelisted, hasClaimedWhitelist]);

    const handleMint = async () => {
        if (!address) {
            setToastMessage('Please connect your wallet to mint.');
            return;
        }

        try {
            if (isWhitelisted && !hasClaimedWhitelist) {
                writeContract({
                    address: CONTRACT_ADDRESS,
                    abi,
                    functionName: 'whitelistMint',
                    args: [merkleProof],
                    value: parseEther('0.0009'), // 10% discount
                });
            } else {
                writeContract({
                    address: CONTRACT_ADDRESS,
                    abi,
                    functionName: 'mint',
                    args: [BigInt(mintAmount)],
                    value: parseEther((0.001 * mintAmount).toString()),
                });
            }
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

    const buttonText = isPending || isConfirming ? 'Minting...' :
        (isWhitelisted && !hasClaimedWhitelist) ? 'Whitelist Mint' : 'Mint';

    return (
        <div className={styles.mintWrapper}>
            <BatchDetails contractAddress={CONTRACT_ADDRESS} />
            {isConnected ? (
                <>
                    {!(isWhitelisted && !hasClaimedWhitelist) && (
                        <div className={styles.mintAmountSelector}>
                            <button onClick={() => setMintAmount(Math.max(1, mintAmount - 1))}>-</button>
                            <span>{mintAmount}</span>
                            <button onClick={() => setMintAmount(Math.min(3, mintAmount + 1))}>+</button>
                        </div>
                    )}
                    <button
                        className={styles.mintButton}
                        onClick={handleMint}
                        disabled={isPending || isConfirming}
                    >
                        {buttonText} {!(isWhitelisted && !hasClaimedWhitelist) && `${mintAmount} SAKEbito`}
                    </button>
                    {isWhitelisted && !hasClaimedWhitelist && (
                        <p className={styles.whitelistStatus}>You are whitelisted! Enjoy a 10% discount on your mint.</p>
                    )}
                </>
            ) : (
                <ConnectButton />
            )}
            {toastMessage && <Toast onClose={closeToast}>{toastMessage}</Toast>}
        </div>
    );
};

export default MintButton;