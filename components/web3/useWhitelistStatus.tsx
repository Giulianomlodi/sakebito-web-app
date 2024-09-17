import { useState, useEffect } from 'react';
import { MerkleTree } from 'merkletreejs';
import { keccak256, encodePacked } from 'viem';

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

export const useWhitelistStatus = (address: string | undefined) => {
    const [isWhitelisted, setIsWhitelisted] = useState(false);
    const [merkleProof, setMerkleProof] = useState<`0x${string}`[]>([]);
    const [merkleRoot, setMerkleRoot] = useState<string>('');

    useEffect(() => {
        const leafNodes = whitelistAddresses.map(addr =>
            keccak256(encodePacked(['address'], [addr.toLowerCase() as `0x${string}`]))
        );
        const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
        const rootHash = merkleTree.getHexRoot();

        setMerkleRoot(rootHash);
        console.log('Merkle Root:', rootHash);

        if (!address) {
            setIsWhitelisted(false);
            setMerkleProof([]);
            return;
        }

        const claimingAddress = keccak256(encodePacked(['address'], [address.toLowerCase() as `0x${string}`]));
        const hexProof = merkleTree.getHexProof(claimingAddress);
        const verified = merkleTree.verify(hexProof, claimingAddress, rootHash);

        setIsWhitelisted(verified);
        setMerkleProof(hexProof as `0x${string}`[]);

        console.log('Address:', address);
        console.log('Is Whitelisted:', verified);
        console.log('Merkle Proof:', hexProof);
    }, [address]);

    return { isWhitelisted, merkleProof, merkleRoot };
};

export default useWhitelistStatus;