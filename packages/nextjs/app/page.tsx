import type { NextPage } from "next";
import { PFPCard } from "~~/components/clawd-pfp/PFPCard";
import pfps from "~~/data/pfps.json";

const OPENSEA_COLLECTION_URL = "https://opensea.io/assets/ethereum/0xb5741b033c45330a34952436a34b1b25a208af10";

type PfpEntry = {
  id: number;
  image: string | null;
  minter: string;
  tokenUri: string;
  name: string | null;
  description: string | null;
};

const entries = pfps as PfpEntry[];
const totalMinted = entries.length;

const Home: NextPage = () => {
  return (
    <div className="flex items-center flex-col grow pt-10 pb-8">
      <div className="px-5 w-full max-w-6xl">
        <div className="text-center mb-8">
          <p className="text-base-content/70 max-w-lg mx-auto mb-2">
            The CLAWD lobster PFP collection. Minting is closed — {totalMinted} PFPs are minted forever.
          </p>
          <p className="text-sm text-base-content/60 max-w-lg mx-auto">
            Browse, transfer, or trade on{" "}
            <a
              href={OPENSEA_COLLECTION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover link-primary"
            >
              OpenSea
            </a>
            .
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map(entry => (
            <PFPCard
              key={entry.id}
              tokenId={entry.id}
              owner={entry.minter}
              image={entry.image}
              description={entry.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
