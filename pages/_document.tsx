import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
	return (
		<Html>
			<Head />
			<body>
				<Main />
				<NextScript />
				<Script
					async
					type="text/javascript"
					strategy="beforeInteractive"
					src="https://static.alchemyapi.io/scripts/analytics/badge-analytics.js"
				></Script>
			</body>
		</Html>
	);
}
