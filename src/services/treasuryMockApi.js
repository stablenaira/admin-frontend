function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    const id = setTimeout(resolve, ms);
    if (!signal) return;
    if (signal.aborted) {
      clearTimeout(id);
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(id);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

function withJitter(n, pct = 0.012) {
  const jitter = (Math.random() * 2 - 1) * pct;
  return n * (1 + jitter);
}

function nowIso() {
  return new Date().toISOString();
}

export async function fetchTreasuryOverview({ signal } = {}) {
  await delay(450, signal);

  return {
    generatedAt: nowIso(),
    networkCount: 5,
    poolCount: 8,
    merchantCount: 14,
    peg: {
      label: "Peg",
      value: withJitter(1.0003, 0.00008),
      unit: "₦",
    },
    alertCount: 2,
    admin: {
      handle: "admin.eth",
      initials: "AO",
    },
    supply: {
      circulating: 412_800_000,
      tokenSymbol: "SNR",
      deltaPct24h: withJitter(2.34, 0.08),
      tvlNgn: 687_200_000,
      collateralRatioPct: withJitter(142.7, 0.01),
    },
    weeklyVolumeNgn: [
      { label: "W1", value: 148_000_000 },
      { label: "W2", value: 172_000_000 },
      { label: "W3", value: 196_000_000 },
      { label: "W4", value: 184_000_000 },
      { label: "W5", value: 218_000_000 },
      { label: "W6", value: 246_000_000 },
      { label: "W7", value: 231_000_000 },
    ].map((p) => ({ ...p, value: Math.round(withJitter(p.value, 0.03)) })),
    kpis: [
      {
        id: "peg_deviation",
        label: "Peg Deviation",
        value: withJitter(0.03, 0.15),
        unit: "%",
        deltaLabel: "Within band",
        trend: "up",
        window: "24h",
      },
      {
        id: "daily_volume",
        label: "Daily Volume",
        value: withJitter(24_100_000, 0.07),
        format: "ngn",
        deltaPct: withJitter(8.92, 0.2),
        trend: "up",
        window: "24h",
        highlight: "accent",
      },
      {
        id: "active_holders",
        label: "Active Holders",
        value: Math.round(withJitter(48_291, 0.03)),
        deltaAbs: Math.round(withJitter(312, 0.25)),
        trend: "up",
        window: "24h",
      },
      {
        id: "reserve_backing",
        label: "Reserve Backing",
        value: withJitter(589_000_000, 0.02),
        format: "ngn",
        deltaPct: withJitter(1.84, 0.2),
        trend: "up",
        window: "24h",
      },
    ],
  };
}

export async function fetchPools({ timeframe = "30D", signal } = {}) {
  await delay(520, signal);

  const pools = [
    {
      id: "snr-usdc",
      name: "SNR / USDC",
      address: "0x4a82…f3d1",
      dex: "Uniswap v3",
      chain: "ETH",
      snrPct: 52,
      snrAmount: "62.4M",
      counterAmount: "38.4K",
      counterSymbol: "USDC",
      tvlNgn: 124_800_000,
      vol24hNgn: 8_200_000,
      vol30dNgn: 231_400_000,
      vol1yNgn: 2_840_000_000,
      health: "Healthy",
      healthTone: "good",
      counterBadge: { bg: "#2775ca", fg: "#fff", label: "$" },
    },
    {
      id: "snr-usdt",
      name: "SNR / USDT",
      address: "0x8c1a…b720",
      dex: "Curve",
      chain: "ETH",
      snrPct: 49,
      snrAmount: "48.9M",
      counterAmount: "30.6K",
      counterSymbol: "USDT",
      tvlNgn: 98_400_000,
      vol24hNgn: 6_100_000,
      vol30dNgn: 178_900_000,
      vol1yNgn: 2_210_000_000,
      health: "Healthy",
      healthTone: "good",
      counterBadge: { bg: "#26a17b", fg: "#fff", label: "$" },
    },
    {
      id: "snr-weth",
      name: "SNR / WETH",
      address: "0x2f5e…91ac",
      dex: "Uniswap v3",
      chain: "ETH",
      snrPct: 58,
      snrAmount: "38.1M",
      counterAmount: "12.4",
      counterSymbol: "WETH",
      tvlNgn: 76_200_000,
      vol24hNgn: 4_800_000,
      vol30dNgn: 142_700_000,
      vol1yNgn: 1_780_000_000,
      health: "Imbalanced",
      healthTone: "warn",
      counterBadge: { bg: "#627eea", fg: "#fff", label: "Ξ" },
    },
    {
      id: "snr-wbtc",
      name: "SNR / WBTC",
      address: "0xa1b3…78d2",
      dex: "SushiSwap",
      chain: "ETH",
      snrPct: 54,
      snrAmount: "24.7M",
      counterAmount: "0.42",
      counterSymbol: "WBTC",
      tvlNgn: 49_600_000,
      vol24hNgn: 2_100_000,
      vol30dNgn: 68_400_000,
      vol1yNgn: 842_000_000,
      health: "Healthy",
      healthTone: "good",
      counterBadge: { bg: "#f7931a", fg: "#fff", label: "₿" },
    },
  ];

  const scaled = pools.map((p) => {
    const factor =
      timeframe === "24H" ? 0.12 : timeframe === "7D" ? 0.45 : timeframe === "30D" ? 1 : 9.5;
    const vol30dNgn = Math.round(withJitter(p.vol30dNgn * (timeframe === "30D" ? 1 : factor), 0.06));

    return {
      ...p,
      vol24hNgn: Math.round(withJitter(p.vol24hNgn, 0.08)),
      vol30dNgn,
      tvlNgn: Math.round(withJitter(p.tvlNgn, 0.02)),
    };
  });

  const healthy = scaled.filter((p) => p.healthTone === "good").length;
  const imbalanced = scaled.length - healthy;
  const winRate = withJitter(94.2, 0.01);

  return {
    timeframe,
    stats: { total: scaled.length, healthy, imbalanced, winRatePct: winRate },
    pools: scaled,
  };
}

export async function fetchReservesRisk({ signal } = {}) {
  await delay(420, signal);

  return {
    collateralRatioPct: withJitter(142.7, 0.01),
    totalReservesNgn: Math.round(withJitter(589_000_000, 0.02)),
    collateralMix: [
      { symbol: "USDC", pct: 42, valueNgn: 247_000_000, color: "#2775ca" },
      { symbol: "USDT", pct: 24, valueNgn: 141_000_000, color: "#26a17b" },
      { symbol: "ETH", pct: 18, valueNgn: 106_000_000, color: "#627eea" },
      { symbol: "WBTC", pct: 9, valueNgn: 53_000_000, color: "#f7931a" },
      { symbol: "DAI & cNGN", pct: 7, valueNgn: 41_000_000, color: "#00ff7a" },
    ],
    chainDistribution: [
      { chain: "Ethereum", symbol: "Ξ", pct: 52.9, amount: "218.4M", color: "#627eea" },
      { chain: "Polygon", symbol: "M", pct: 20.4, amount: "84.2M", color: "#8247e5" },
      { chain: "BNB Chain", symbol: "B", pct: 15.2, amount: "62.8M", color: "#f0b90b", fg: "#000" },
      { chain: "Arbitrum", symbol: "A", pct: 7.7, amount: "31.6M", color: "#28a0f0" },
      { chain: "Optimism", symbol: "O", pct: 3.8, amount: "15.8M", color: "#ff0420" },
    ],
    alerts: [
      {
        id: "ratio_drift",
        tone: "warn",
        title: "SNR/WETH ratio drift",
        message: "SNR share 58% (threshold 55%).",
        meta: "12 min ago · Uniswap v3",
      },
      {
        id: "large_mint",
        tone: "info",
        title: "Large mint pending",
        message: "2M SNR mint awaiting 1 more co-signer.",
        meta: "1h 24m ago · Multisig",
      },
      {
        id: "oracles_ok",
        tone: "good",
        title: "Oracles synced",
        message: "All 4 feeds within 4 bps.",
        meta: "3 min ago · Oracles",
      },
    ],
  };
}

export async function fetchSupplyControls({ signal } = {}) {
  await delay(360, signal);

  return {
    multisig: { threshold: "3-of-5 required" },
    mint: {
      headroomSNR: 87_200_000,
      destination: "0x7Fa3...e21B · Ethereum",
      newCirculating: "413.8M SNR",
      requiredCollateral: "$612.40 USDC",
      postRatio: "142.5%",
      gasEstimate: "0.0024 ETH",
    },
    burn: {
      treasurySNR: 22_800_000,
      source: "0x7Fa3...e21B · Ethereum",
      newCirculating: "412.3M SNR",
      collateralReleased: "$306.20 USDC",
      postRatio: "142.9%",
      gasEstimate: "0.0019 ETH",
    },
  };
}

export async function fetchMerchants({ timeframe = "30D", signal } = {}) {
  await delay(560, signal);

  const merchants = [
    {
      id: "fw",
      name: "Flutterwave Treasury",
      meta: "MID-FW-001 · 0x7e4a…21cb",
      logo: { letter: "F", bg: "rgba(0,255,122,0.10)", fg: "#00ff7a" },
      category: { label: "Fintech", tone: "info" },
      tier: "T1",
      quotaUsed: 38.2,
      quotaCap: 50,
      minted: 38.2,
      burned: 22.4,
      net: +15.8,
      status: { label: "Active", tone: "good" },
    },
    {
      id: "ps",
      name: "Paystack Vault",
      meta: "MID-PS-002 · 0xa1c9…8d4f",
      logo: { letter: "P", bg: "rgba(107,184,255,0.10)", fg: "#6bb8ff" },
      category: { label: "Fintech", tone: "info" },
      tier: "T1",
      quotaUsed: 28.4,
      quotaCap: 50,
      minted: 28.4,
      burned: 19.6,
      net: +8.8,
      status: { label: "Active", tone: "good" },
    },
    {
      id: "qx",
      name: "Quidax Exchange",
      meta: "MID-QX-003 · 0xc3b2…f019",
      logo: { letter: "Q", bg: "rgba(0,255,122,0.08)", fg: "#00ff7a" },
      category: { label: "Exchange", tone: "good" },
      tier: "T1",
      quotaUsed: 22.1,
      quotaCap: 30,
      minted: 22.1,
      burned: 18.9,
      net: +3.2,
      status: { label: "Active", tone: "good" },
    },
    {
      id: "lz",
      name: "Lazerpay",
      meta: "MID-LZ-006 · 0xd9a1…83fe",
      logo: { letter: "L", bg: "rgba(212,255,107,0.10)", fg: "#d4ff6b" },
      category: { label: "Remittance", tone: "warn" },
      tier: "T2",
      quotaUsed: 9.4,
      quotaCap: 15,
      minted: 9.4,
      burned: 11.8,
      net: -2.4,
      status: { label: "Active", tone: "good" },
    },
    {
      id: "nb",
      name: "Nairabox",
      meta: "MID-NB-009 · 0x4d12…cc40",
      logo: { letter: "N", bg: "rgba(255,84,84,0.12)", fg: "#ff5454" },
      category: { label: "Fintech", tone: "info" },
      tier: "T2",
      quotaUsed: 9.6,
      quotaCap: 10,
      minted: 9.6,
      burned: 0.0,
      net: +9.6,
      status: { label: "Quota cap", tone: "paused" },
    },
  ];

  const timeframeMultiplier = timeframe === "24H" ? 0.12 : timeframe === "7D" ? 0.45 : timeframe === "30D" ? 1 : 10;

  const scaled = merchants.map((m) => {
    const scale = (v) => Math.round(withJitter(v * timeframeMultiplier, 0.08) * 10) / 10;
    return {
      ...m,
      minted: scale(m.minted),
      burned: scale(m.burned),
      net: Math.round(withJitter(m.net * timeframeMultiplier, 0.08) * 10) / 10,
    };
  });

  return {
    timeframe,
    stats: {
      activeCount: 14,
      pendingCount: 2,
      totalMintedM: withJitter(142.6, 0.04),
      totalBurnedM: withJitter(98.2, 0.04),
      netInflowM: withJitter(44.4, 0.06),
      feesK: withJitter(240.8, 0.06),
    },
    merchants: scaled,
  };
}

export async function fetchGovernance({ signal } = {}) {
  await delay(520, signal);

  return {
    multisigQueue: [
      { id: "q1", type: "Mint Operation", amount: "+2,000,000", tone: "good", signed: 2, required: 3, ttl: "4h left", action: "Sign" },
      { id: "q2", type: "Burn Operation", amount: "−800,000", tone: "warn", signed: 1, required: 3, ttl: "11h left", action: "Sign" },
      { id: "q3", type: "Collateral Swap", amount: "USDT → USDC", tone: "info", signed: 3, required: 3, ttl: "ready", action: "Execute" },
    ],
    oracles: [
      { id: "cl", name: "Chainlink", source: "NGN/USD · Aggregator", price: "₦1.00031", ago: "12s ago", tone: "good" },
      { id: "rs", name: "RedStone", source: "NGN/USD · On-demand", price: "₦1.00028", ago: "8s ago", tone: "good" },
      { id: "py", name: "Pyth", source: "NGN/USD · Pull", price: "₦1.00034", ago: "3s ago", tone: "good" },
      { id: "tw", name: "Internal TWAP", source: "15-min weighted", price: "₦1.00029", ago: "Live", tone: "good" },
      { id: "cb", name: "CBN reference", source: "Official rate", price: "₦1.00000", ago: "09:00 daily", tone: "dim" },
    ],
    topHolders: [
      { id: "h1", rank: "01", address: "0x4a82…f3d1", tag: "Pool", tagTone: "warn", balance: "62.4M", pct: "15.1%" },
      { id: "h2", rank: "02", address: "0x8c1a…b720", tag: "Pool", tagTone: "warn", balance: "48.9M", pct: "11.8%" },
      { id: "h3", rank: "03", address: "0x2f5e…91ac", tag: "Pool", tagTone: "warn", balance: "38.1M", pct: "9.2%" },
      { id: "h4", rank: "04", address: "0x7Fa3…e21B", tag: "Treasury", tagTone: "good", balance: "22.8M", pct: "5.5%" },
      { id: "h5", rank: "05", address: "0xb1d4…a032", tag: "Binance", tagTone: "info", balance: "18.2M", pct: "4.4%" },
      { id: "h6", rank: "06", address: "0x3e9f…44c8", tag: "Bybit", tagTone: "info", balance: "12.4M", pct: "3.0%" },
      { id: "h7", rank: "07", address: "0x9c01…7f23", tag: "Whale", tagTone: "dim", balance: "8.9M", pct: "2.2%" },
    ],
  };
}

export async function fetchActivity({ filter = "All", signal } = {}) {
  await delay(480, signal);

  const all = [
    { id: "a1", type: "mint", title: "Mint to Treasury Vault", subtitle: "0x7Fa3…e21B · tx 0x9a8c…1f2e", amount: "+1,500,000 SNR", context: "Ethereum", time: "2m ago" },
    { id: "a2", type: "swap", title: "Large swap · SNR → USDC", subtitle: "Binance Hot Wallet · 0xb1d4…a032", amount: "850,000 SNR", context: "Uniswap v3", time: "4m ago" },
    { id: "a3", type: "burn", title: "Burn from Treasury", subtitle: "0x7Fa3…e21B · tx 0x2c44…b8e1", amount: "−320,000 SNR", context: "Ethereum", time: "11m ago" },
    { id: "a4", type: "bridge", title: "Bridge · ETH → Polygon", subtitle: "LayerZero · 0x8c1a…b720", amount: "2,400,000 SNR", context: "Polygon", time: "18m ago" },
    { id: "a5", type: "mint", title: "Merchant mint · Flutterwave", subtitle: "0x7e4a…21cb · MID-FW-001", amount: "+750,000 SNR", context: "Ethereum", time: "26m ago" },
    { id: "a6", type: "swap", title: "Large swap · USDT → SNR", subtitle: "Bybit · 0x3e9f…44c8", amount: "1,200,000 SNR", context: "Curve", time: "34m ago" },
    { id: "a7", type: "bridge", title: "Bridge · ETH → BSC", subtitle: "Wormhole · 0x6d2c…04ef", amount: "980,000 SNR", context: "BNB Chain", time: "47m ago" },
    { id: "a8", type: "burn", title: "Merchant burn · Quidax", subtitle: "0xc3b2…f019 · MID-QX-003 · Redemption", amount: "−145,000 SNR", context: "Ethereum", time: "1h 2m ago" },
  ];

  if (filter === "All") return { filter, items: all };
  return { filter, items: all.filter((x) => x.type === filter.toLowerCase()) };
}

