import {
	darkTheme,
	getDefaultWallets,
	RainbowKitProvider
} from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { chain, WagmiConfig, createClient, configureChains } from "wagmi";

import { init } from "src/utils/store";
import { DataProvider } from "src/hooks/useData";

import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

const { chains, provider } = configureChains(
	[chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
	[alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
	appName: "Uliquid",
	chains
});

const wagmiClient = createClient({
	provider,
	connectors,
	autoConnect: true
});

function MyApp({ Component, pageProps }) {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<DataProvider init={init}>
			<QueryClientProvider client={queryClient}>
				<Hydrate state={pageProps.dehydratedState}>
					<WagmiConfig client={wagmiClient}>
						<RainbowKitProvider
							chains={chains}
							theme={darkTheme({ accentColor: "#32C1CC" })}
						>
							<Component {...pageProps} />
						</RainbowKitProvider>
					</WagmiConfig>
				</Hydrate>
			</QueryClientProvider>
		</DataProvider>
	);
}

export default MyApp;
