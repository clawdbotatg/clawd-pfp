"use client";

import { Address } from "@scaffold-ui/components";
import { mainnet } from "viem/chains";

type PFPCardProps = {
  tokenId: number;
  owner: string;
  prompt: string;
  imageUrl?: string;
};

export const PFPCard = ({ tokenId, owner, prompt, imageUrl }: PFPCardProps) => {
  return (
    <div className="card bg-base-100 shadow-xl overflow-hidden">
      <figure className="bg-base-300 aspect-square flex items-center justify-center">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={`CLAWD PFP #${tokenId}`} className="w-full h-full object-cover" />
        ) : (
          <div className="text-4xl opacity-30">🦞</div>
        )}
      </figure>
      <div className="card-body p-4">
        <h3 className="card-title text-sm font-bold">CLAWD PFP #{tokenId}</h3>
        <div className="flex items-center gap-1 text-xs">
          <span className="opacity-60">Owner:</span>
          <Address address={owner as `0x${string}`} chain={mainnet} size="xs" />
        </div>
        <p className="text-xs opacity-70 line-clamp-2 italic">&quot;{prompt}&quot;</p>
      </div>
    </div>
  );
};
