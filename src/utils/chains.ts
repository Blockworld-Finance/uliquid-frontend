import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { chain, createClient, configureChains } from "wagmi";

import {
	asterChain,
	BNBSmartChain,
	avalancheChain
} from "src/utils/customChains";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";

const { chains, provider } = configureChains(
	[
		asterChain,
		chain.mainnet,
		chain.polygon,
		BNBSmartChain,
		chain.optimism,
		chain.arbitrum,
		avalancheChain
	],
	[alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
	chains,
	appName: "Uliquid"
});

const wagmiClient = createClient({
	provider,
	connectors,
	autoConnect: true
});

export default wagmiClient;
