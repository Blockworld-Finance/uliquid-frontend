import { gql } from "graphql-request";
import client from "src/utils/client";
import { LendingProtocolUserData, LiquidationQuote } from "src/schema";
import { GetProtocolResponse, NormalizedProtocols, TFAQ, TGuide } from "@types";

export const getProtocols = async () => {
	const query = gql`
		{
			getProtocols {
				url
				name
				logo
				description
				versions {
					protocolName
					name
					contracts {
						chain {
							id
							name
							logo
						}
					}
				}
			}
		}
	`;

	const data = (await client().request(query)) as GetProtocolResponse;

	const chains = [];
	data.getProtocols.forEach((protocol, p) => {
		chains[p] = {
			versions: [],
			url: protocol.url,
			name: protocol.name,
			logo: protocol.logo,
			description: protocol.description
		};
		protocol.versions.forEach((version, i) => {
			const uniqueChains = [];
			chains[p].versions[i] = {
				name: version.name,
				protocolName: version.protocolName,
				chains: []
			};

			version.contracts.forEach(contract => {
				if (!uniqueChains.includes(contract.chain.name)) {
					uniqueChains.push(contract.chain.name);
					chains[p].versions[i].chains.push(contract.chain);
				}
			});
		});
	});

	return chains as NormalizedProtocols;
};

type TUserData = {
	chainId: number;
	address: string;
	version: string;
	protocol: string;
};

export const getUserData = async ({
	address,
	chainId,
	protocol,
	version
}: TUserData) => {
	const query = gql`
		query GetLendingProtocolUserData(
			$user: String!
			$protocol: String!
			$chainId: Int!
			$version: String!
		) {
			getLendingProtocolUserData(
				user: $user
				protocol: $protocol
				chainId: $chainId
				version: $version
			) {
				totalSuppliedUSD
				totalBorrowedUSD
				availableBorrowsUSD
				healthFactor
				user
				protocol
				version
				markets {
					marketLogo
					amountSuppliedUSD
					amountBorrowedUSD
					amountSupplied
					amountBorrowed
					depositAPY
					borrowAPY
					usageAsCollateralEnabled
					marketSymbol
					marketName
					marketAddress
					user
				}
			}
		}
	`;

	const data = await client().request(query, {
		user: address,
		protocol,
		chainId,
		version
	});
	return data as { getLendingProtocolUserData: LendingProtocolUserData };
};

type TLiquidationProps = {
	user: string;
	debt: string;
	collateral: string;
	debtAmount: number;
	protocol: string;
	chainId: number;
	version: string;
	slippage: number;
	signal?: AbortSignal;
};

export const getLiquidation = async ({
	user,
	debt,
	collateral,
	debtAmount,
	protocol,
	chainId,
	version,
	slippage,
	signal
}: TLiquidationProps) => {
	const query = gql`
		query GetLiquidationQuote(
			$user: String!
			$debt: String!
			$collateral: String!
			$debtAmount: Float!
			$protocol: String!
			$chainId: Int!
			$version: String!
			$slippage: Float!
		) {
			getLiquidationQuote(
				user: $user
				debt: $debt
				collateral: $collateral
				debtAmount: $debtAmount
				protocol: $protocol
				chainId: $chainId
				version: $version
				slippage: $slippage
			) {
				canLiquidate
				collateral
				debt
				collateralAmount
				debtAmountUSD
				collateralAmountUSD
				debtAmount
				fee
				reason
				slippage
				swapQuote {
					amountIn
					amountOut
					path {
						pool
						tokenIn
						tokenOut
					}
					priceImpact
					tokenIn
					tokenOut
				}
			}
		}
	`;

	const data = await client(signal).request(query, {
		user,
		debt,
		chainId,
		version,
		slippage,
		protocol,
		debtAmount,
		collateral
	});

	return data.getLiquidationQuote as LiquidationQuote;
};

type TLeverageProps = {
	user: string;
	debt: string;
	chainId: number;
	version: string;
	protocol: string;
	slippage: number;
	debtAmount: number;
	collateral: string;
	signal?: AbortSignal;
	collateralizationRatio: number;
	initialCollateralAmount: number;
};

export const getLeverageQuote = async ({
	user,
	debt,
	chainId,
	signal,
	version,
	protocol,
	slippage,
	collateral,
	debtAmount,
	collateralizationRatio,
	initialCollateralAmount
}: TLeverageProps) => {
	const query = gql`
		query GetLendingProtocolLeverageQuote(
			$user: String!
			$debt: String!
			$chainId: Int!
			$version: String!
			$slippage: Float!
			$protocol: String!
			$collateral: String!
			$collateralizationRatio: Int!
			$initialCollateralAmount: Float!
		) {
			getLendingProtocolLeverageQuote(
				debt: $debt
				user: $user
				chainId: $chainId
				version: $version
				protocol: $protocol
				slippage: $slippage
				collateral: $collateral
				collateralizationRatio: $collateralizationRatio
				initialCollateralAmount: $initialCollateralAmount
			) {
				debt
				loops
				reason
				slippage
				collateral
				canLeverage
				swapQuote {
					tokenIn
					tokenOut
					amountIn
					amountOut
					path {
						pool
						tokenIn
						tokenOut
					}
					priceImpact
				}
				leveragedDebtAmount
				estimatedHealthFactor
				collateralizationRatio
				leveragedDebtAmountUSD
				initialCollateralAmount
				leveragedCollateralAmount
				leveragedCollateralAmountUSD
			}
		}
	`;

	const data = await client(signal).request(query, {
		user,
		debt,
		chainId,
		version,
		slippage,
		protocol,
		debtAmount,
		collateral,
		collateralizationRatio,
		initialCollateralAmount
	});

	return data.getLiquidationQuote as LiquidationQuote;
};

type TTokenValueProps = {
	token: string;
	quoteToken: string;
	chainId: number;
	getTokenUsdValueToken2: string;
	getTokenUsdValueChainId2: number;
};

export const getTokenUSDValue = async ({
	token,
	chainId,
	quoteToken,
	getTokenUsdValueChainId2,
	getTokenUsdValueToken2
}: TTokenValueProps) => {
	const query = gql`
		query Query(
			$token: String!
			$quoteToken: String!
			$chainId: Int!
			$getTokenUsdValueToken2: String!
			$getTokenUsdValueChainId2: Int!
		) {
			getTokenValue(token: $token, quoteToken: $quoteToken, chainId: $chainId)
			getTokenUSDValue(
				token: $getTokenUsdValueToken2
				chainId: $getTokenUsdValueChainId2
			)
		}
	`;

	const data = await client().request(query, {
		token,
		chainId,
		quoteToken,
		getTokenUsdValueToken2,
		getTokenUsdValueChainId2
	});

	return data as { getTokenValue: number; getTokenUSDValue: number };
};

type TGLPLiquidateTxProps = {
	user: string;
	chainId: number;
	version: string;
	protocol: string;
	liquidationQuote: LiquidationQuote;
};

export const getLendingProtocolLiquidateTx = async ({
	user,
	chainId,
	version,
	protocol,
	liquidationQuote
}: TGLPLiquidateTxProps) => {
	const query = gql`
		query GetLendingProtocolLiquidateTx(
			$user: String!
			$protocol: String!
			$chainId: Int!
			$version: String!
			$liquidationQuote: LiquidationQuoteInput
		) {
			getLendingProtocolLiquidateTx(
				user: $user
				protocol: $protocol
				chainId: $chainId
				version: $version
				liquidationQuote: $liquidationQuote
			) {
				data
				error
				from
				to
			}
		}
	`;

	const data = await client().request(query, {
		user,
		chainId,
		version,
		protocol,
		liquidationQuote
	});

	return data;
};

type TGLPLeverageTxProps = {
	user: string;
	chainId: number;
	version: string;
	protocol: string;
	leverageQuote: LiquidationQuote;
};

export const getLendingProtocolLeverageTx = async ({
	user,
	chainId,
	version,
	protocol,
	leverageQuote
}: TGLPLeverageTxProps) => {
	const query = gql`
		query GetLendingProtocolLeverageTx(
			$user: String!
			$protocol: String!
			$chainId: Int!
			$version: String!
			$leverageQuote: LeverageQuoteInput
		) {
			getLendingProtocolLeverageTx(
				user: $user
				protocol: $protocol
				chainId: $chainId
				version: $version
				leverageQuote: $leverageQuote
			) {
				from
				to
				data
				error
			}
		}
	`;

	const data = await client().request(query, {
		user,
		chainId,
		version,
		protocol,
		leverageQuote
	});

	return data;
};

export type TGetURLsResponse = {
	getURLs: {
		github: string;
		twitter: string;
		discord: string;
		documentation: string;
	};
};
export const getURLS = async () => {
	const query = gql`
		{
			getURLs {
				github
				twitter
				discord
				documentation
			}
			getFAQs {
				question
				answer
			}
		}
	`;

	const data = (await client().request(query)) as TGetURLsResponse;
	return data;
};

export type TGetFAQsResponse = {
	getFAQs: TFAQ[];
};

export const getFAQs = async () => {
	const query = gql`
		{
			getFAQs {
				question
				answer
			}
		}
	`;

	const data = (await client().request(query)) as TGetFAQsResponse;
	return data;
};

export type TGetGuideResponse = {
	getGuide: TGuide[];
};

export const getGuide = async () => {
	const query = gql`
		{
			getGuide {
				heading
				images
				text
			}
		}
	`;

	const data = (await client().request(query)) as TGetFAQsResponse;
	return data;
};
