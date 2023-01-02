import { Chain, Version } from "./schema";

export type AppData = {
	activeChain: number;
	activeVersion: number;
	activeProtocol: number;
};

export interface AnyObject<T = any, D = any> extends D {
	[key: string]: T;
}

type GetProtocolResponse = {
	getProtocols: {
		url: string;
		logo: string;
		name: string;
		description: string;
		versions: Version[];
	}[];
};

type TFAQ = {
	answer: string;
	question: string;
};

type TGuide = {
	text: string;
	heading: string;
	images: string[];
};

type NormalizedProtocol = {
	url: string;
	name: string;
	logo: string;
	description: string;
	versions: {
		name: string;
		protocolName: string;
		chains: Chain[];
	}[];
};

type NormalizedProtocols = NormalizedProtocol[];

type GetLiquidationResult = {
	canLiquidate: boolean;
	collateral: string;
	collateralAmount: number;
	debt: string;
	debtAmount: number;
	debtAmountUSD: number;
	collateralAmountUSD: number;
	fee: number;
	reason: string;
	slippage: number;
	swapQuote: {
		amountIn: number;
		amountOut: number;
		path: {
			pool: string;
			tokenIn: string;
			tokenOut: string;
		};
		priceImpact: number;
		tokenIn: string;
		tokenOut: string;
	};
};

type TGetLendingProtocolMarkets = {
	getLendingProtocolMarkets: {
		logo: string;
		name: string;
		symbol: string;
		version: string;
		address: string;
		protocol: string;
		totalSupplied: number;
		totalBorrowed: number;
		totalAvailable: number;
		totalSuppliedUSD: number;
		totalBorrowedUSD: number;
		totalAvailableUSD: number;
		minCollateralizationRatio: number;
	}[];
};

type TLeverageInput = {
	user: string;
	chainId: number;
	version: string;
	protocol: string;
	leverageQuote: LeverageQuoteInput;
};
