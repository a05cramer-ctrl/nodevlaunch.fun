// ─────────────────────────────────────────────────────────────
//  NODEV: the only file you edit before launch.
//  Leave `ca` empty and the site shows "Launching soon" with a
//  countdown. Paste the mint and it goes live: CA box, Buy and
//  Chart buttons, live market data and the launcher-wallet check.
// ─────────────────────────────────────────────────────────────
window.NODEV_CONFIG = {
  ticker: "$NODEV",
  ca: "",                                    // $NODEV mint address
  launchTimeUtc: "2026-11-07T16:00:00Z",     // countdown target while ca is empty
  launchesOpen: "2026-11-14T16:00:00Z",      // when anyone can launch a coin on Nodev (shown on the Reserve section)

  // The public launcher wallet that creates every Nodev coin. It never holds a token.
  // Shown on the token card with a live balance check once ca is set.
  launcher: "",

  links: {
    x: "https://x.com/nodevfun"              // change to the real handle
  },

  rpc: "https://api.mainnet-beta.solana.com",

  buyUrl:   (ca) => `https://raydium.io/launchpad/token/?mint=${ca}`,
  chartUrl: (ca) => `https://dexscreener.com/solana/${ca}`,
  solscan:  (a)  => `https://solscan.io/account/${a}`
};
