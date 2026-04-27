"use client";

import Image from "next/image";

type PFPCardProps = {
  tokenId: number;
  owner: string;
  image: string | null;
  description: string | null;
};

const OPENSEA_COLLECTION = "0xb5741b033c45330a34952436a34b1b25a208af10";

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export const PFPCard = ({ tokenId, owner, image, description }: PFPCardProps) => {
  const openseaUrl = `https://opensea.io/item/ethereum/${OPENSEA_COLLECTION}/${tokenId}`;

  return (
    <div className="card bg-base-100 shadow-xl overflow-hidden">
      <a
        href={openseaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block transition-opacity hover:opacity-90"
      >
        <figure className="bg-base-300 aspect-square relative">
          {image ? (
            <Image
              src={image}
              alt={`CLAWD PFP #${tokenId}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-30">⚠️</div>
          )}
        </figure>
      </a>
      <div className="card-body p-4">
        <a href={openseaUrl} target="_blank" rel="noopener noreferrer" className="link link-hover">
          <h3 className="card-title text-sm font-bold">CLAWD PFP #{tokenId}</h3>
        </a>
        <div className="flex items-center gap-1 text-xs">
          <span className="opacity-60">Minted by:</span>
          <span className="font-mono opacity-80">{truncateAddress(owner)}</span>
        </div>
        {description && <p className="text-xs opacity-70 line-clamp-2 italic">&quot;{description}&quot;</p>}
      </div>
    </div>
  );
};
