import { NextRequest, NextResponse } from "next/server";
import { isAddress } from "viem";

// In-memory rate limiting (resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

const GENERATE_CV_COST = 500_000;

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
    const { wallet, prompt, signature } = body;

    // --- Validate inputs ---
    if (!wallet || !isAddress(wallet)) {
      return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 });
    }
    if (!prompt || typeof prompt !== "string" || prompt.length === 0 || prompt.length > 280) {
      return NextResponse.json({ error: "Prompt must be 1-280 characters" }, { status: 400 });
    }
    if (!signature || typeof signature !== "string") {
      return NextResponse.json({ error: "Signature is required" }, { status: 400 });
    }

    // --- Strip HTML/script tags from prompt ---
    const sanitizedPrompt = prompt.replace(/<[^>]*>/g, "").trim();
    if (sanitizedPrompt.length === 0) {
      return NextResponse.json({ error: "Prompt cannot be empty after sanitization" }, { status: 400 });
    }

    // --- Rate limit check ---
    const rateCheck = checkRateLimit(wallet);
    if (!rateCheck.allowed) {
      const retryAfterSec = Math.ceil((rateCheck.retryAfterMs || 0) / 1000);
      return NextResponse.json(
        { error: `Rate limit exceeded. Try again in ${Math.ceil(retryAfterSec / 60)} minutes.` },
        { status: 429 },
      );
    }

    // --- Check mint deadline ---
    // TODO: Read mintDeadline from ClawdPFP contract on mainnet via Alchemy RPC
    // const alchemyRpc = `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
    // const publicClient = createPublicClient({ chain: mainnet, transport: http(alchemyRpc) });
    // const mintDeadline = await publicClient.readContract({ ... });
    // if (BigInt(Math.floor(Date.now() / 1000)) > mintDeadline) {
    //   return NextResponse.json({ error: "Minting window has closed" }, { status: 410 });
    // }

    // --- Check CV balance ---
    // TODO: GET https://larv.ai/api/cv/balance?address={wallet}
    // const balanceRes = await fetch(`https://larv.ai/api/cv/balance?address=${wallet}`);
    // const balanceData = await balanceRes.json();
    // if (balanceData.balance < GENERATE_CV_COST) {
    //   return NextResponse.json({
    //     error: `Insufficient CV balance. Need ${GENERATE_CV_COST}, have ${balanceData.balance}`,
    //   }, { status: 402 });
    // }

    // --- Charge CV via larv.ai ---
    // TODO: POST https://larv.ai/api/cv/spend
    // const chargeRes = await fetch("https://larv.ai/api/cv/spend", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     wallet,
    //     signature,
    //     amount: GENERATE_CV_COST,
    //     secret: process.env.CV_SPEND_SECRET,
    //   }),
    // });
    // if (!chargeRes.ok) {
    //   return NextResponse.json({ error: "Failed to charge CV" }, { status: 500 });
    // }

    // --- Generate PFP via LeftClaw PFP API ---
    // TODO: POST https://leftclaw.services/api/pfp/generate-cv
    // The worker wallet signs its own "larv.ai CV Spend" message and calls the PFP API.
    // The worker pays the PFP API cost from its own CV. The user is charged separately above.
    // const pfpRes = await fetch("https://leftclaw.services/api/pfp/generate-cv", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     prompt: sanitizedPrompt,
    //     wallet: workerWalletAddress,
    //     signature: workerSignature,
    //   }),
    // });
    // const pfpData = await pfpRes.json();
    // if (!pfpRes.ok) {
    //   // TODO: Attempt CV refund on failure
    //   return NextResponse.json({ error: "Image generation failed" }, { status: 500 });
    // }

    // --- STUB: Return mock data for now ---
    // In production, `image` would come from pfpData.image (base64 or URL)
    const mockImage =
      "data:image/svg+xml;base64," +
      Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
          <rect width="512" height="512" fill="#1a1a2e"/>
          <circle cx="256" cy="220" r="120" fill="#e94560"/>
          <circle cx="220" cy="195" r="18" fill="white"/>
          <circle cx="292" cy="195" r="18" fill="white"/>
          <circle cx="220" cy="195" r="9" fill="#1a1a2e"/>
          <circle cx="292" cy="195" r="9" fill="#1a1a2e"/>
          <path d="M 210 260 Q 256 295 302 260" fill="none" stroke="white" stroke-width="4"/>
          <text x="256" y="400" text-anchor="middle" fill="#e94560" font-size="24" font-family="monospace">CLAWD PFP</text>
          <text x="256" y="440" text-anchor="middle" fill="#888" font-size="14" font-family="monospace">${sanitizedPrompt.substring(0, 30)}</text>
        </svg>`,
      ).toString("base64");

    return NextResponse.json({
      image: mockImage,
      prompt: sanitizedPrompt,
      cvSpent: GENERATE_CV_COST,
      newBalance: 2_000_000, // TODO: Read actual updated balance
    });
  } catch (error) {
    console.error("Generate API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
