import React, { useEffect, useState } from 'react';
import { useReadContract, useWatchContractEvent } from 'wagmi';
import { formatEther } from 'viem';
import { abi } from '../../contract-abi';

// Define the type for batch details
interface BatchDetails {
    name: string;
    cost: string;
    limit: bigint;
    active: boolean;
    minted: bigint;
}

// Define the props type
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

    return (
        <div>
            <h2>Batch Details</h2>
            <p>Name: {batchDetails.name}</p>
            <p>Cost: {batchDetails.cost} ETH</p>
            <p>Active: {batchDetails.active ? 'Yes' : 'No'}</p>
            <p>Limit: {batchDetails.limit.toString()}</p>
            <p>Minted: {batchDetails.minted.toString()}</p>
        </div>
    );
};

export default BatchDetails;