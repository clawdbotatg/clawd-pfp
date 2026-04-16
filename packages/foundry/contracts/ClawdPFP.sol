// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @title ClawdPFP
 * @notice ERC-721 NFT collection with immutable token URIs and a time-locked mint window.
 *         Only the designated minter (server wallet / relayer) can call mint().
 *         After mintDeadline, mint() reverts permanently — the collection is frozen forever.
 *         No setTokenURI, no setMinter, no pause, no owner, no upgrade path.
 */
contract ClawdPFP is ERC721 {
    /// @notice The only address authorized to call mint()
    address public immutable minter;

    /// @notice Unix timestamp after which mint() reverts permanently
    uint256 public immutable mintDeadline;

    /// @notice Auto-incrementing token ID counter (starts at 0)
    uint256 private _tokenIdCounter;

    /// @notice Mapping from token ID to its IPFS metadata URI (set once, never changed)
    mapping(uint256 => string) private _tokenURIs;

    /// @notice Emitted when a new PFP is minted
    /// @param tokenId The newly minted token's ID
    /// @param to The recipient address
    /// @param prompt The prompt used to generate this PFP (stored in event logs for gallery display)
    event PFPMinted(uint256 indexed tokenId, address indexed to, string prompt);

    /// @notice Reverts when a non-minter address tries to call mint()
    error OnlyMinter();

    /// @notice Reverts when mint() is called after the deadline
    error MintWindowClosed();

    /// @notice Reverts when tokenURI is queried for a nonexistent token
    error TokenDoesNotExist();

    /**
     * @param _minter The server wallet address authorized to call mint()
     * @param _mintDuration How many seconds from deployment until minting closes (e.g., 604800 for 7 days)
     */
    constructor(address _minter, uint256 _mintDuration) ERC721("CLAWD PFP", "CPFP") {
        minter = _minter;
        mintDeadline = block.timestamp + _mintDuration;
    }

    /**
     * @notice Mint a new PFP NFT to the given address with the given metadata URI.
     * @dev Only callable by the minter before the mintDeadline.
     * @param to The recipient of the NFT
     * @param _tokenURI The IPFS URI pointing to the token's metadata JSON
     */
    function mint(address to, string calldata _tokenURI) external {
        if (msg.sender != minter) revert OnlyMinter();
        if (block.timestamp > mintDeadline) revert MintWindowClosed();

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter = tokenId + 1;

        _safeMint(to, tokenId);
        _tokenURIs[tokenId] = _tokenURI;

        emit PFPMinted(tokenId, to, _tokenURI);
    }

    /**
     * @notice Returns the metadata URI for a given token.
     * @dev Overrides ERC721.tokenURI to return stored per-token URIs.
     * @param tokenId The token ID to query
     * @return The IPFS metadata URI for this token
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (_ownerOf(tokenId) == address(0)) revert TokenDoesNotExist();
        return _tokenURIs[tokenId];
    }
}
