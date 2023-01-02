import {
	darkTheme,
	getDefaultWallets,
	RainbowKitProvider
} from "@rainbow-me/rainbowkit";
import { useState } from "react";
import Router from "next/router";
import NProgress from "nprogress";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { chain, WagmiConfig, createClient, configureChains } from "wagmi";

import {
	asterChain,
	BNBSmartChain,
	avalancheChain
} from "src/utils/customChains";
import { init } from "src/utils/store";
import { DataProvider } from "src/hooks/useData";

import "../styles/globals.css";
import "nprogress/nprogress.css";
import "rc-slider/assets/index.css";
import "@rainbow-me/rainbowkit/styles.css";
import { useTokenBalance } from "@hooks/useQueries";

const { chains, provider } = configureChains(
	[
		chain.mainnet,
		chain.polygon,
		chain.optimism,
		chain.arbitrum,
		avalancheChain,
		asterChain,
		BNBSmartChain
	],
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

NProgress.configure({ showSpinner: false });

Router.events.on("routeChangeError", () => NProgress.done());
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());

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
