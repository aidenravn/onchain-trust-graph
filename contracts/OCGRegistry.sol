// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

/**
 * @title OnChainTrustGraph Registry
 * @author ravN
 *
 * Stores cryptographically provable human continuity roots.
 * Used by Seedless Wallets, Safe UX, and Reputation layers.
 */
contract OCGRegistry {

    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/

    error InvalidGuardian();
    error InvalidThreshold();
    error ProofAlreadyUsed();
    error InvalidOldRoot();

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/

    event IdentityRootRegistered(
        address indexed wallet,
        bytes32 oldRoot,
        bytes32 newRoot,
        uint256 timestamp
    );

    /*//////////////////////////////////////////////////////////////
                              STORAGE
    //////////////////////////////////////////////////////////////*/

    // wallet => current identity graph root
    mapping(address => bytes32) public identityRoot;

    // used continuity proofs (replay protection)
    mapping(bytes32 => bool) public usedProofs;

    /*//////////////////////////////////////////////////////////////
                          CORE FUNCTION
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Register a new identity continuity root
     * @param oldRoot Previous identity root (0x0 if first time)
     * @param newRoot New Merkle root of identity graph
     * @param guardians List of guardian addresses
     * @param signatures EIP-712 guardian approvals
     */
    function registerContinuity(
        bytes32 oldRoot,
        bytes32 newRoot,
        address[] calldata guardians,
        bytes[] calldata signatures
    ) external {

        if (guardians.length != signatures.length) {
            revert InvalidThreshold();
        }

        // replay protection
        bytes32 proofHash = keccak256(
            abi.encode(msg.sender, oldRoot, newRoot, guardians)
        );

        if (usedProofs[proofHash]) {
            revert ProofAlreadyUsed();
        }

        // verify previous root
        if (identityRoot[msg.sender] != oldRoot) {
            revert InvalidOldRoot();
        }

        // verify guardians
        for (uint256 i; i < guardians.length; i++) {
            bytes32 digest = keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n32",
                    keccak256(abi.encode(msg.sender, oldRoot, newRoot))
                )
            );

            address signer = recover(digest, signatures[i]);

            if (signer != guardians[i]) {
                revert InvalidGuardian();
            }
        }

        // mark proof as used
        usedProofs[proofHash] = true;

        // store new root
        identityRoot[msg.sender] = newRoot;

        emit IdentityRootRegistered(
            msg.sender,
            oldRoot,
            newRoot,
            block.timestamp
        );
    }

    /*//////////////////////////////////////////////////////////////
                          SIGNATURE UTILS
    //////////////////////////////////////////////////////////////*/

    function recover(bytes32 hash, bytes memory sig)
        internal
        pure
        returns (address)
    {
        require(sig.length == 65, "bad sig length");

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }

        return ecrecover(hash, v, r, s);
    }
}
