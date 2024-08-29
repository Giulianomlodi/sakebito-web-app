import { useCallback, useState, useMemo } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { abi } from '../../contract-abi';

const CONTRACT_ADDRESS = '0x084aaf400ac39b0d36daf82852005625d7d8b009';

type BatchData = {
    id: bigint;
    name: string;
    baseUri: string;
    cost: bigint;
    limit: bigint;
    active: boolean;
    ended: boolean;
    minted: bigint;
};

export const useContractInteraction = () => {
    const { address } = useAccount();
    const [error, setError] = useState<string | null>(null);
    const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

    const { data: whitelistMintUsed } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'whitelistClaimed',
        args: address ? [address] : undefined,
    });

    const { data: currentBatchId } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'currentBatchId',
    });

    const { data: currentBatchArray, refetch: refetchCurrentBatch } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'batches',
        args: currentBatchId ? [currentBatchId] : undefined,
    });

    const currentBatch: BatchData | undefined = useMemo(() => {
        if (!currentBatchArray) return undefined;
        const [id, name, baseUri, cost, limit, active, ended, minted] = currentBatchArray;
        return { id, name, baseUri, cost, limit, active, ended, minted };
    }, [currentBatchArray]);

    const { writeContract: writeMint } = useWriteContract();

    const { writeContract: writeWhitelistMint } = useWriteContract();

    const { isLoading: isTxLoading, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
        hash: txHash,
    });

    const mint = useCallback(async (amount: number) => {
        if (!address) {
            setError("Wallet not connected");
            return;
        }
        try {
            if (!currentBatch) throw new Error("Batch info not available");
            const value = parseEther((currentBatch.cost * BigInt(amount)).toString());
            const result = await writeMint({
                address: CONTRACT_ADDRESS,
                abi,
                functionName: 'mint',
                args: [BigInt(amount)],
                value,
            });
            if (result) {
                setTxHash(result);
            }
            refetchCurrentBatch();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
    }, [address, writeMint, currentBatch, refetchCurrentBatch]);

    const whitelistMint = useCallback(async (merkleProof: `0x${string}`[]) => {
        if (!address) {
            setError("Wallet not connected");
            return;
        }
        try {
            if (!currentBatch) throw new Error("Batch info not available");
            const discountedPrice = (currentBatch.cost * BigInt(90)) / BigInt(100); // 10% discount
            const value = discountedPrice;
            const result = await writeWhitelistMint({
                address: CONTRACT_ADDRESS,
                abi,
                functionName: 'whitelistMint',
                args: [merkleProof],
                value,
            });
            if (result) {
                setTxHash(result);
            }
            refetchCurrentBatch();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
    }, [address, writeWhitelistMint, currentBatch, refetchCurrentBatch]);

    const mintingStatus = useMemo(() => {
        if (isTxLoading) return 'loading';
        if (isTxSuccess) return 'success';
        return 'idle';
    }, [isTxLoading, isTxSuccess]);

    return {
        whitelistMintUsed: !!whitelistMintUsed,
        currentBatch,
        mint,
        whitelistMint,
        mintingStatus,
        error,
    };
};

export default useContractInteraction;