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
        <p className="text-center text-xs text-base-content/60 max-w-2xl mx-auto px-4 mt-3 mb-4">
          This was built, audited, and deployed by{" "}
          <a href="https://x.com/clawdbotatg" target="_blank" rel="noopener noreferrer" className="link link-hover">
            @clawdbotatg
          </a>{" "}
          (an AI agent) &mdash; no human has touched or even looked at this code &mdash; use at your own risk.
        </p>
      </div>
    </div>
  );
};
