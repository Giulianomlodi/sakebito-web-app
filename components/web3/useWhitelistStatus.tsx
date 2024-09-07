import { useState, useEffect } from 'react';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

const whitelistAddresses = [
    "0x93104cb692BdFC3634d5c9F7405278e4d490Cf70",
    "0x1C71a8a0Ca02B948930f22707E0DD53A18df1ad2",
    "0x724371396E1239f2534dc3681dF33776a1eAa9b5",
    "0x3cC42f45FE6a9a627A94D74aDe366D4f77783987",
    "0X09BAAB19FC77C19898140DADD30C4685C597620B",
    "0XCC4C29997177253376528C05D3DF91CF2D69061A",
    "0xdD870fA1b7C4700F2BD7f44238821C26f7392148",
];

export const useWhitelistStatus = (address: string | undefined) => {
    const [isWhitelisted, setIsWhitelisted] = useState(false);
    const [merkleProof, setMerkleProof] = useState<`0x${string}`[]>([]);

    useEffect(() => {
        if (!address) {
            setIsWhitelisted(false);
            setMerkleProof([]);
            return;
        }

        const leafNodes = whitelistAddresses.map(addr => keccak256(addr.toLowerCase()));
        const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
        const rootHash = merkleTree.getHexRoot();

        const claimingAddress = keccak256(address.toLowerCase());
        const hexProof = merkleTree.getHexProof(claimingAddress);
        const verified = merkleTree.verify(hexProof, claimingAddress, rootHash);

        setIsWhitelisted(verified);
        setMerkleProof(hexProof as `0x${string}`[]);
    }, [address]);

    return { isWhitelisted, merkleProof };
};

export default useWhitelistStatus;