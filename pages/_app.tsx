import { useState } from "react";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { chain, WagmiConfig, createClient, configureChains } from "wagmi";
import { getDefaultWallets, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";

import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

const { chains, provider } = configureChains(
	[chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
	[alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
	appName: "My RainbowKit App",
	chains,
});

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider,
});

function MyApp({ Component, pageProps }) {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			<Hydrate state={pageProps.dehydratedState}>
				<WagmiConfig client={wagmiClient}>
					<RainbowKitProvider chains={chains} theme={darkTheme({ accentColor: "#32C1CC" })}>
						<Component {...pageProps} />
					</RainbowKitProvider>
				</WagmiConfig>
			</Hydrate>
		</QueryClientProvider>
	);
}

export default MyApp;
