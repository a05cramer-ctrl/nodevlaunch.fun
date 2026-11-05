// ─────────────────────────────────────────────────────────────
//  NODEV: the only file you edit before launch.
//  Leave `ca` empty and the site shows "Launching soon" with a
//  countdown. With the mint set it is live: CA box, Buy (pump.fun)
//  and Chart buttons, live market data and the launcher-wallet check.
// ─────────────────────────────────────────────────────────────
window.NODEV_CONFIG = {
  ticker: "$NODEV",
  ca: "2RbmKxqXjisuM65SW62Av5soHpFThAhNcnH4khzbpump",   // $NODEV mint address
  launchTimeUtc: "2026-11-07T16:00:00Z",     // countdown target while ca is empty
  launchesOpen: "2026-11-14T16:00:00Z",      // when anyone can launch a coin on Nodev (shown on the Reserve section)

  // The public launcher wallet that creates every Nodev coin. It never holds a token.
  // Shown on the token card with a live balance check once ca is set.
  launcher: "",

  links: {
    x: "https://x.com/nodevlaunchray"
  },

  rpc: "https://api.mainnet-beta.solana.com",

  buyUrl:   (ca) => `https://pump.fun/coin/${ca}`,   // $NODEV was minted on pump.fun
  chartUrl: (ca) => `https://dexscreener.com/solana/${ca}`,
  solscan:  (a)  => `https://solscan.io/account/${a}`
};
