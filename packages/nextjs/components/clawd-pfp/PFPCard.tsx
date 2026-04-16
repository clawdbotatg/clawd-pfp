"use client";

import { useEffect, useState } from "react";
import { Address } from "@scaffold-ui/components";
import { mainnet } from "viem/chains";

type PFPCardProps = {
  tokenId: number;
  owner: string;
  tokenUri: string;
};

type Metadata = {
  name?: string;
  description?: string;
  image?: string;
};

export const PFPCard = ({ tokenId, owner, tokenUri }: PFPCardProps) => {
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(tokenUri)
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((json: Metadata) => {
        if (!cancelled) setMetadata(json);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [tokenUri]);

  return (
    <div className="card bg-base-100 shadow-xl overflow-hidden">
      <figure className="bg-base-300 aspect-square flex items-center justify-center">
        {metadata?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={metadata.image} alt={`CLAWD PFP #${tokenId}`} className="w-full h-full object-cover" />
        ) : error ? (
          <div className="text-4xl opacity-30">⚠️</div>
        ) : (
          <div className="skeleton w-full h-full" />
        )}
      </figure>
      <div className="card-body p-4">
        <h3 className="card-title text-sm font-bold">CLAWD PFP #{tokenId}</h3>
        <div className="flex items-center gap-1 text-xs">
          <span className="opacity-60">Owner:</span>
          <Address address={owner as `0x${string}`} chain={mainnet} size="xs" />
        </div>
        {metadata?.description && (
          <p className="text-xs opacity-70 line-clamp-2 italic">&quot;{metadata.description}&quot;</p>
        )}
      </div>
    </div>
  );
};
