import { Chain } from "wagmi";

export const avalancheChain: Chain = {
	id: 43_114,
	name: "Avalanche C-Chain",
	network: "avalanche",
	// @ts-ignore
	iconBackground: "#0C0B0E",
	iconUrl:
		"https://blockchain-rdata.s3.amazonaws.com/icons/chains/avalanche.svg",
	nativeCurrency: {
		decimals: 18,
		symbol: "AVAX",
		name: "Avalanche"
	},
	rpcUrls: {
		default: "https://api.avax.network/ext/bc/C/rpc"
	},
	blockExplorers: {
		default: { name: "SnowTrace", url: "https://snowtrace.io" },
		etherscan: { name: "SnowTrace", url: "https://snowtrace.io" }
	},
	testnet: false
};

export const asterChain: Chain = {
	id: 592,
	name: "Astar",
	network: "Astar",
	// @ts-ignore
	iconBackground: "#0C0B0E",
	iconUrl: "https://blockchain-rdata.s3.amazonaws.com/icons/chains/astar.svg",
	nativeCurrency: {
		decimals: 18,
		name: "Astar",
		symbol: "ASTR"
	},
	rpcUrls: {
		default: "https://evm.astar.network/"
	},
	blockExplorers: {
		default: { name: "SnowTrace", url: "https://blockscout.com/astar" }
	},
	testnet: false
};

export const BNBSmartChain: Chain = {
	id: 56,
	name: "BNB Smart Chain Mainnet",
	network: "BNB Smart Chain Mainnet",
	// @ts-ignore
	iconBackground: "#0C0B0E",
	iconUrl: "https://blockchain-rdata.s3.amazonaws.com/icons/chains/bnb.svg",
	nativeCurrency: {
		decimals: 18,
		symbol: "BNB",
		name: "BNB Smart Chain"
	},
	rpcUrls: {
		default: "https://bsc-dataseed1.binance.org"
	},
	blockExplorers: {
		default: { name: "SnowTrace", url: "https://bscscan.com/" }
	},
	testnet: false
};
