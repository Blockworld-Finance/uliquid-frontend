import { Version } from "./schema";

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

type NormalizedProtocols = {
	url: string;
	name: string;
	logo: string;
	description: string;
	versions: {
		name: string;
		protocolName: string;
		chains: {
			id: number;
			name: string;
			logo: string;
		}[];
	}[];
}[];

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
