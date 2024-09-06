// components/web3/BatchDetails.tsx
import React, { useEffect, useState } from 'react';
import { useReadContract, useWatchContractEvent, useChainId } from 'wagmi';
import { formatEther } from 'viem';
import { abi } from '../../contract-abi';
import styles from '../../src/styles/BatchDetails.module.css'; // Make sure this path is correct

interface BatchDetailsProps {
    contractAddress: `0x${string}`;
}

interface BatchDetails {
    name: string;
    cost: string;
    limit: bigint;
    active: boolean;
    minted: bigint;
}

const BatchDetails: React.FC<BatchDetailsProps> = ({ contractAddress }) => {
    const [batchDetails, setBatchDetails] = useState<BatchDetails | null>(null);
    const chainId = useChainId();

    const { data: batchData, refetch, error } = useReadContract({
        address: contractAddress,
        abi,
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
        console.log("Raw batch data:", batchData);
        if (batchData && Array.isArray(batchData) && batchData.length >= 8) {
            console.log("Parsed batch details:", {
                name: batchData[1] as string,
                cost: formatEther(batchData[3] as bigint),
                limit: batchData[4] as bigint,
                active: batchData[5] as boolean,
                minted: batchData[7] as bigint,
            });
            setBatchDetails({
                name: batchData[1] as string,
                cost: formatEther(batchData[3] as bigint),
                limit: batchData[4] as bigint,
                active: batchData[5] as boolean,
                minted: batchData[7] as bigint,
            });
        }
    }, [batchData]);

    useEffect(() => {
        if (error) {
            console.error("Error fetching batch details:", error);
        }
    }, [error]);

    useEffect(() => {
        refetch();
    }, [chainId, contractAddress, refetch]);

    if (!batchDetails) {
        return <div className={styles.loading}>Loading batch details...</div>;
    }

    const remainingMints = batchDetails.limit - batchDetails.minted;

    return (
        <div className={styles.batchDetails}>
            <h2 className={styles.title}>Batch Details</h2>
            <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                    <span className={styles.label}>Name:</span>
                    <span className={styles.value}>{batchDetails.name}</span>
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.label}>Cost:</span>
                    <span className={styles.value}>{batchDetails.cost} ETH</span>
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.label}>Active:</span>
                    <span className={styles.value}>{batchDetails.active ? 'Yes' : 'No'}</span>
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.label}>Limit:</span>
                    <span className={styles.value}>{remainingMints.toString()}/{batchDetails.limit.toString()}</span>
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.label}>Minted:</span>
                    <span className={styles.value}>{batchDetails.minted.toString()}</span>
                </div>
            </div>
        </div>
    );
};

export default BatchDetails;