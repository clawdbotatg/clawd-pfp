// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/ClawdPFP.sol";

contract ClawdPFPTest is Test {
    ClawdPFP public pfp;
    address public minter;
    address public user;
    uint256 public constant MINT_DURATION = 604800; // 7 days

    event PFPMinted(uint256 indexed tokenId, address indexed to, string tokenURI);

    function setUp() public {
        minter = vm.addr(1);
        user = vm.addr(2);
        pfp = new ClawdPFP(minter, MINT_DURATION);
    }

    function testConstructorSetsState() public view {
        assertEq(pfp.minter(), minter);
        assertEq(pfp.mintDeadline(), block.timestamp + MINT_DURATION);
        assertEq(pfp.name(), "CLAWD PFP");
        assertEq(pfp.symbol(), "CPFP");
    }

    function testMintBeforeDeadline() public {
        string memory tokenURI = "ipfs://QmTestHash123";

        vm.prank(minter);
        pfp.mint(user, tokenURI);

        assertEq(pfp.ownerOf(0), user);
        assertEq(pfp.tokenURI(0), tokenURI);
        assertEq(pfp.balanceOf(user), 1);
    }

    function testMintRevertsAfterDeadline() public {
        // Warp past the deadline
        vm.warp(block.timestamp + MINT_DURATION + 1);

        vm.prank(minter);
        vm.expectRevert(ClawdPFP.MintWindowClosed.selector);
        pfp.mint(user, "ipfs://QmTooLate");
    }

    function testMintRevertsExactlyAtDeadline() public {
        // Warp exactly to the deadline — should still work (<=)
        vm.warp(block.timestamp + MINT_DURATION);

        vm.prank(minter);
        pfp.mint(user, "ipfs://QmExactDeadline");

        assertEq(pfp.ownerOf(0), user);
    }

    function testOnlyMinterCanMint() public {
        vm.prank(user);
        vm.expectRevert(ClawdPFP.OnlyMinter.selector);
        pfp.mint(user, "ipfs://QmUnauthorized");
    }

    function testTokenURIReturnsCorrectly() public {
        string memory uri1 = "ipfs://QmFirstToken";
        string memory uri2 = "ipfs://QmSecondToken";

        vm.startPrank(minter);
        pfp.mint(user, uri1);
        pfp.mint(user, uri2);
        vm.stopPrank();

        assertEq(pfp.tokenURI(0), uri1);
        assertEq(pfp.tokenURI(1), uri2);
    }

    function testTokenURIRevertsForNonexistentToken() public {
        vm.expectRevert(ClawdPFP.TokenDoesNotExist.selector);
        pfp.tokenURI(999);
    }

    function testPFPMintedEventEmitted() public {
        string memory tokenURI = "ipfs://QmEventTest";

        vm.expectEmit(true, true, false, true);
        emit PFPMinted(0, user, tokenURI);

        vm.prank(minter);
        pfp.mint(user, tokenURI);
    }

    function testSequentialTokenIds() public {
        vm.startPrank(minter);
        pfp.mint(user, "ipfs://QmFirst");
        pfp.mint(user, "ipfs://QmSecond");
        pfp.mint(vm.addr(3), "ipfs://QmThird");
        vm.stopPrank();

        assertEq(pfp.ownerOf(0), user);
        assertEq(pfp.ownerOf(1), user);
        assertEq(pfp.ownerOf(2), vm.addr(3));
    }

    function testMultipleMintsSameUser() public {
        vm.startPrank(minter);
        pfp.mint(user, "ipfs://Qm1");
        pfp.mint(user, "ipfs://Qm2");
        pfp.mint(user, "ipfs://Qm3");
        vm.stopPrank();

        assertEq(pfp.balanceOf(user), 3);
    }

    function testConstructorRevertsOnZeroMinter() public {
        vm.expectRevert(ClawdPFP.ZeroAddress.selector);
        new ClawdPFP(address(0), MINT_DURATION);
    }

    function testConstructorRevertsOnZeroDuration() public {
        vm.expectRevert(ClawdPFP.DurationTooShort.selector);
        new ClawdPFP(minter, 0);
    }
}
