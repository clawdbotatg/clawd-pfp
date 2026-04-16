import { NextRequest, NextResponse } from "next/server";
import { isAddress } from "viem";

// In-memory rate limiting (resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

const MINT_CV_COST = 1_000_000;
// Minimum ETH the relayer needs to pay gas. Used in preflight checks.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _MIN_RELAYER_ETH_BALANCE = 0.05; // ETH

function checkRateLimit(wallet: string): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(wallet.toLowerCase());

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(wallet.toLowerCase(), { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count += 1;
  return { allowed: true };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet, imageDataUrl, prompt, signature } = body;

    // --- Validate inputs ---
    if (!wallet || !isAddress(wallet)) {
      return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 });
    }
    if (!imageDataUrl || typeof imageDataUrl !== "string") {
      return NextResponse.json({ error: "Image data is required" }, { status: 400 });
    }
    if (!prompt || typeof prompt !== "string" || prompt.length === 0 || prompt.length > 280) {
      return NextResponse.json({ error: "Prompt must be 1-280 characters" }, { status: 400 });
    }
    if (!signature || typeof signature !== "string") {
      return NextResponse.json({ error: "Signature is required" }, { status: 400 });
    }

    // --- Strip HTML/script tags from prompt ---
    // Used in metadata JSON when IPFS pinning is enabled
    const _sanitizedPrompt = prompt.replace(/<[^>]*>/g, "").trim();
    void _sanitizedPrompt; // Will be used when TODO stubs are replaced

    // --- Rate limit check ---
    const rateCheck = checkRateLimit(wallet);
    if (!rateCheck.allowed) {
      const retryAfterSec = Math.ceil((rateCheck.retryAfterMs || 0) / 1000);
      return NextResponse.json(
        { error: `Rate limit exceeded. Try again in ${Math.ceil(retryAfterSec / 60)} minutes.` },
        { status: 429 },
      );
    }

    // --- Preflight: Check relayer ETH balance on mainnet ---
    // TODO: Uncomment when deploying
    // const alchemyRpc = `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
    // const publicClient = createPublicClient({ chain: mainnet, transport: http(alchemyRpc) });
    // const relayerAddress = privateKeyToAddress(process.env.RELAYER_PRIVATE_KEY as `0x${string}`);
    // const relayerBalance = await publicClient.getBalance({ address: relayerAddress });
    // if (Number(formatEther(relayerBalance)) < MIN_RELAYER_ETH_BALANCE) {
    //   return NextResponse.json(
    //     { error: "Minting temporarily unavailable", reason: "relayer_low_balance" },
    //     { status: 503 },
    //   );
    // }

    // --- Check mintDeadline (with 5-minute grace period) ---
    // TODO: Read mintDeadline from contract
    // const mintDeadline = await publicClient.readContract({ ... });
    // const nowSec = BigInt(Math.floor(Date.now() / 1000));
    // const gracePeriod = BigInt(5 * 60); // 5 minutes
    // if (nowSec > mintDeadline - gracePeriod) {
    //   return NextResponse.json({ error: "Minting window has closed" }, { status: 410 });
    // }

    // --- Check CV balance ---
    // TODO: GET https://larv.ai/api/cv/balance?address={wallet}
    // if (balance < MINT_CV_COST) return 402

    // --- Pin image to IPFS ---
    // TODO: Decode base64 image, pin to IPFS via Pinata or bgipfs
    // const imageBuffer = Buffer.from(imageDataUrl.split(",")[1], "base64");
    // const imageCID = await pinata.pinFileToIPFS(imageBuffer, { pinataMetadata: { name: `clawd-pfp-image` } });
    // const imageURI = `ipfs://${imageCID.IpfsHash}`;

    // --- Build and pin metadata JSON ---
    // TODO: Read _tokenIdCounter from contract to predict tokenId
    // const tokenId = await publicClient.readContract({ functionName: "_tokenIdCounter" });
    // const metadata = {
    //   name: `CLAWD PFP #${tokenId}`,
    //   description: `Custom CLAWD PFP: ${sanitizedPrompt}`,
    //   image: imageURI,
    //   attributes: [
    //     { trait_type: "Prompt", value: sanitizedPrompt },
    //     { trait_type: "Minted By", value: wallet },
    //   ],
    // };
    // const metadataCID = await pinata.pinJSONToIPFS(metadata);
    // const tokenURI = `ipfs://${metadataCID.IpfsHash}`;

    // --- Charge CV (after IPFS pinning succeeds) ---
    // TODO: POST https://larv.ai/api/cv/spend
    // const chargeRes = await fetch("https://larv.ai/api/cv/spend", { ... });
    // if (!chargeRes.ok) return 500;

    // --- Simulate mint transaction ---
    // TODO: Simulate before sending to catch reverts
    // await publicClient.simulateContract({
    //   address: contractAddress,
    //   abi: ClawdPFPAbi,
    //   functionName: "mint",
    //   args: [wallet, tokenURI],
    //   account: relayerAddress,
    // });

    // --- Send mint transaction from relayer wallet ---
    // TODO: Create walletClient with relayer private key and call mint()
    // const walletClient = createWalletClient({
    //   account: privateKeyToAccount(process.env.RELAYER_PRIVATE_KEY),
    //   chain: mainnet,
    //   transport: http(alchemyRpc),
    // });
    // const txHash = await walletClient.writeContract({
    //   address: contractAddress,
    //   abi: ClawdPFPAbi,
    //   functionName: "mint",
    //   args: [wallet, tokenURI],
    // });
    // const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

    // --- STUB: Return mock data for now ---
    const mockTxHash = "0x" + "a".repeat(64);
    const mockTokenId = 0;
    const mockTokenURI = "ipfs://QmMockMetadataHash";

    return NextResponse.json({
      txHash: mockTxHash,
      tokenId: mockTokenId,
      tokenURI: mockTokenURI,
      ipfsImageUrl: "ipfs://QmMockImageHash",
      cvSpent: MINT_CV_COST,
      newBalance: 1_000_000, // TODO: Read actual updated balance
    });
  } catch (error) {
    console.error("Mint API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
