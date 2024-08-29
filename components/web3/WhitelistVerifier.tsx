import React, { useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

// This should be replaced with your actual whitelist addresses
const whitelistAddresses = [
    "0x3cC42f45FE6a9a627A94D74aDe366D4f77783987",
    "0xC2444C5323cE66519b381F6d67e0229546Fef528",
    "0XDCAB482177A592E424D1C8318A464FC922E8DE40",
    "0X6E21D37E07A6F7E53C7ACE372CEC63D4AE4B6BD0",
    "0X09BAAB19FC77C19898140DADD30C4685C597620B",
    "0XCC4C29997177253376528C05D3DF91CF2D69061A",
    "0xdD870fA1b7C4700F2BD7f44238821C26f7392148",
];

// Replace this with the actual admin address
const ADMIN_ADDRESS = "0x3cC42f45FE6a9a627A94D74aDe366D4f77783987";

interface WhitelistVerifierProps {
    onProofGenerated: (proof: `0x${string}`[], isWhitelisted: boolean) => void;
}

const WhitelistVerifier: React.FC<WhitelistVerifierProps> = ({ onProofGenerated }) => {
    const { address } = useAccount();

    const verifyWhitelist = useCallback(() => {
        // Create Merkle Tree and calculate root hash
        const leafNodes = whitelistAddresses.map((addr) => keccak256(addr.toLowerCase()));
        const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
        const rootHash = merkleTree.getHexRoot();

        // Log Merkle root to console only if the current user is the admin
        if (address && address.toLowerCase() === ADMIN_ADDRESS.toLowerCase()) {
            console.log('Merkle Root (for smart contract):', rootHash);
        }

        if (address) {
            const claimingAddress = keccak256(address.toLowerCase());
            const hexProof = merkleTree.getHexProof(claimingAddress);
            const verified = merkleTree.verify(hexProof, claimingAddress, rootHash);

            onProofGenerated(hexProof as `0x${string}`[], verified);
        }
    }, [address, onProofGenerated]);

    useEffect(() => {
        verifyWhitelist();
    }, [verifyWhitelist]);

    return null; // This component doesn't render anything visually
};

export default WhitelistVerifier;