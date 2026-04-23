import Link from "next/link";
import type { NextPage } from "next";

const Generate: NextPage = () => {
  return (
    <div className="flex items-center flex-col grow pt-10 pb-8">
      <div className="px-5 w-full max-w-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Minting is closed</h1>
        <p className="text-base-content/70 mb-6">
          The CLAWD PFP mint window has ended. The collection is permanently frozen — no new PFPs can be generated or
          minted.
        </p>
        <Link href="/" className="btn btn-primary">
          View the gallery
        </Link>
      </div>
    </div>
  );
};

export default Generate;
