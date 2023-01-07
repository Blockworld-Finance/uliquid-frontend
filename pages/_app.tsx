import { useState } from "react";
import Router from "next/router";
import NProgress from "nprogress";
import { WagmiConfig } from "wagmi";
import { ToastContainer } from "react-toastify";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";

import { init } from "src/utils/store";
import wagmiClient from "src/utils/chains";
import { DataProvider } from "src/hooks/useData";

import "../styles/globals.css";
import "nprogress/nprogress.css";
import "rc-slider/assets/index.css";
import "@rainbow-me/rainbowkit/styles.css";
import "react-toastify/dist/ReactToastify.css";
import 'aos/dist/aos.css';

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
							chains={wagmiClient.chains}
							theme={darkTheme({
								accentColor: "white",
								accentColorForeground: "black"
							})}
						>
							<Component {...pageProps} />
						</RainbowKitProvider>
					</WagmiConfig>
					<ToastContainer
						position="top-right"
						autoClose={5000}
						hideProgressBar={false}
						newestOnTop={false}
						closeOnClick
						rtl={false}
						pauseOnFocusLoss
						draggable
						pauseOnHover
						theme="dark"
					/>
				</Hydrate>
			</QueryClientProvider>
		</DataProvider>
	);
}

export default MyApp;
