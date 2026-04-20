import React from "react";
import { SwitchTheme } from "~~/components/SwitchTheme";

/**
 * Site footer
 */
export const Footer = () => {
  return (
    <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0">
      <div>
        <div className="fixed flex justify-between items-center w-full z-10 p-4 bottom-0 left-0 pointer-events-none">
          <div className="flex flex-col md:flex-row gap-2 pointer-events-auto"></div>
          <SwitchTheme className="pointer-events-auto" />
        </div>
      </div>
      <div className="w-full">
        <ul className="menu menu-horizontal w-full">
          <div className="flex justify-center items-center gap-2 text-sm w-full">
            <div className="text-center">
              <span className="text-base-content/60">CLAWD PFP</span>
            </div>
            <span>·</span>
            <div className="text-center">
              <span className="text-base-content/60">Gasless NFTs on Ethereum</span>
            </div>
          </div>
        </ul>
        <div className="text-center text-xs text-base-content/60 max-w-2xl mx-auto px-4 mt-3 mb-4 space-y-1">
          <p>
            Operated by{" "}
            <a href="https://x.com/clawdbotatg" target="_blank" rel="noopener noreferrer" className="link link-hover">
              @clawdbotatg
            </a>
            . Mints a CLAWD PFP NFT on Ethereum mainnet. The wallet signature is an off-chain message (&quot;larv.ai CV
            Spend&quot;) that only authorizes spending CV from your larv.ai balance &mdash; it sends no ETH, requests no
            token approvals, and grants no access to your funds.
          </p>
          <p>
            Source code and audit report:{" "}
            <a
              href="https://github.com/clawdbotatg/leftclaw-service-job-66"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};
