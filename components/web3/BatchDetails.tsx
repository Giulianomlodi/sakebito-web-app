import React, { useEffect, useState } from 'react';
import { useReadContract, useWatchContractEvent } from 'wagmi';
import { formatEther } from 'viem';
import { abi } from '../../contract-abi';
import styles from '../../src/styles/MintButton.module.css';

interface BatchDetails {
    name: string;
    cost: string;
    limit: bigint;
    active: boolean;
    minted: bigint;
}

interface BatchDetailsProps {
    contractAddress: `0x${string}`;
}

const BatchDetails: React.FC<BatchDetailsProps> = ({ contractAddress }) => {
    const [batchDetails, setBatchDetails] = useState<BatchDetails | null>(null);

    const { data: batchData, refetch } = useReadContract({
        abi,
        address: contractAddress,
        functionName: 'batches',
        args: [1n], // Reading batch with ID 1
    });

    useWatchContractEvent({
        address: contractAddress,
        abi,
        eventName: 'NFTMinted',
        onLogs() {
            refetch();
        },
    });

    useEffect(() => {
        if (batchData && Array.isArray(batchData) && batchData.length >= 8) {
            setBatchDetails({
                name: batchData[1] as string,
                cost: formatEther(batchData[3] as bigint),
                limit: batchData[4] as bigint,
                active: batchData[5] as boolean,
                minted: batchData[7] as bigint,
            });
        }
    }, [batchData]);

    if (!batchDetails) {
        return <div>Loading batch details...</div>;
    }

    const remainingMints = batchDetails.limit - batchDetails.minted;

    return (
        <div className={styles.batchDetails}>
            <h2>Edition Details</h2>
            <div className={styles.batchGrid}>
                <div className={styles.batchItem}>
                    <span>Name:</span>
                    <span>{batchDetails.name}</span>
                </div>
                <div className={styles.batchItem}>
                    <span>Cost:</span>
                    <span>{batchDetails.cost} ETH</span>
                </div>
                <div className={styles.batchItem}>
                    <span>Active:</span>
                    <span>{batchDetails.active ? 'Yes' : 'No'}</span>
                </div>
                <div className={styles.batchItem}>
                    <span>Limit:</span>
                    <span>{remainingMints.toString()}/{batchDetails.limit.toString()}</span>
                </div>
                <div className={styles.batchItem}>
                    <span>Minted:</span>
                    <span>{batchDetails.minted.toString()}</span>
                </div>
            </div>
        </div>
    );
};

export default BatchDetails;