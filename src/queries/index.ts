import { gql } from "graphql-request";
import client from "src/utils/client";
import { LendingProtocolUserData, Version } from "src/schema";
import {
	GetLiquidationResult,
	GetProtocolResponse,
	NormalizedProtocols
} from "@types";

export const getProtocols = async () => {
	const query = gql`
		{
			getProtocols {
				name
				description
				logo
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

	const normalizeData = () => {
		const chains = [];
		data.getProtocols.forEach((protocol, p) => {
			chains[p] = {
				versions: [],
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

		return chains;
	};

	return normalizeData() as NormalizedProtocols;
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
	signal: AbortSignal;
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
		collateral,
		debtAmount,
		protocol,
		chainId,
		version,
		slippage
	});

	return data.getLiquidationQuote as GetLiquidationResult;
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
