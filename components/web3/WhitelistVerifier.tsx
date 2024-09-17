import React, { useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

// This should be replaced with your actual whitelist addresses
const whitelistAddresses = [
    "0x93104cb692BdFC3634d5c9F7405278e4d490Cf70",
    "0x1C71a8a0Ca02B948930f22707E0DD53A18df1ad2",
    "0x724371396E1239f2534dc3681dF33776a1eAa9b5",
    "0x3cC42f45FE6a9a627A94D74aDe366D4f77783987",
    "0X09BAAB19FC77C19898140DADD30C4685C597620B",
    "0XCC4C29997177253376528C05D3DF91CF2D69061A",
    "0xdD870fA1b7C4700F2BD7f44238821C26f7392148",
    "0xf3Ff5Cc05E6340E7949546E509DA113c5bC52685",
    "0xbA4760A2b7E747Dd3EB60e265e8E997BC397957A",
    "0x39B33a79f42453B1beFAb2435e5AAb8169C1B3b4",
    "0x2E70F8a381efd5142474E8ce61fa3d05D3CE0576",
    "0x2a3Ea12cE3C95b44206C60aCb90043711dFF9A7e",
    "0xCBA69d3fd92dc945284d007acD5F96bE6B8dc4aB",
    "0xAF82a5AFc84fC9B38F6424DD4AEf393a41a35AA0",
    "0xE43563A4c58aE485578597b7Cad0614517152c09",
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