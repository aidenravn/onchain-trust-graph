// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
    ArcVault → On-Chain Trust Graph Adapter

    This contract turns ArcVault Contribution NFTs into
    cryptographic identity leaves usable by OCG.

    It does NOT custody tokens.
    It only reads ArcVault and hashes facts into trust-graph leaves.
*/

interface IArcVault {
    function ownerOf(uint256 tokenId) external view returns (address);

    function info(uint256 tokenId)
        external
        view
        returns (
            string memory cid,
            uint8 category,
            uint8 score,
            address approver
        );
}

contract ArcVaultAdapter {

    bytes32 public constant ARCV_DOMAIN = keccak256("ARCV1");

    /*
        This is the core primitive.

        It produces a deterministic identity leaf from an ArcVault NFT.

        If ANY of these change:
        - owner
        - score
        - category
        - approver

        the identity hash changes.
    */
    function arcVaultLeaf(
        address arcVault,
        uint256 tokenId
    ) public view returns (bytes32) {
        IArcVault av = IArcVault(arcVault);

        address owner = av.ownerOf(tokenId);
        (
            ,               // cid ignored (off-chain)
            uint8 category,
            uint8 score,
            address approver
        ) = av.info(tokenId);

        return keccak256(
            abi.encodePacked(
                ARCV_DOMAIN,
                arcVault,
                tokenId,
                owner,
                category,
                score,
                approver
            )
        );
    }

    /*
        Verifies that a wallet still controls a contribution NFT.
        Used by OCG registry before attaching identity edges.
    */
    function verifyOwnership(
        address arcVault,
        uint256 tokenId,
        address user
    ) external view returns (bool) {
        return IArcVault(arcVault).ownerOf(tokenId) == user;
    }
}
