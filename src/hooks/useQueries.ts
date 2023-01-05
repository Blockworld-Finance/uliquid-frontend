import {
	getUserData,
	getProtocols,
	getLiquidation,
	getTokenUSDValue,
	getTokenBalances,
	getLeverageQuote,
	getNativeTokenUSDValue,
	getLendingProtocolMarkets
} from "src/queries";
import { useRef } from "react";
import { useAccount } from "wagmi";
import { useQuery } from "react-query";

import useData from "./useData";
import { AnyObject, NormalizedProtocols } from "@types";
import { LeverageQuoteInput, LiquidationQuote } from "@schema";
import { toast } from "react-toastify";

export function useProtocols(data?: NormalizedProtocols) {
	return useQuery(["protocols"], getProtocols, {
		...(data && { initialData: data }),
		refetchOnMount: false,
		refetchInterval: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false
	});
}

export function useUserData() {
	const { data: protocols } = useProtocols();
	const {
		data: { activeChain, activeProtocol, activeVersion }
	} = useData();
	const { address, isConnected } = useAccount();

	return useQuery(
		["user-data", activeProtocol, activeChain, activeVersion],
		() =>
			getUserData({
				address,
				protocol: protocols[activeProtocol].name,
				version: protocols[activeProtocol].versions[activeVersion].name,
				chainId:
					protocols[activeProtocol].versions[activeVersion].chains[activeChain]
						.id
			}),
		{
			enabled: isConnected
		}
	);
}

export function useTokenBalance() {
	const { address, isConnected } = useAccount();
	const {
		data: { activeChain, activeVersion, activeProtocol }
	} = useData();
	const { data } = useProtocols();

	return useQuery(
		[
			"token-balance",
			address,
			data?.[activeProtocol]?.versions[activeVersion].chains[activeChain].id
		],
		() =>
			getTokenBalances({
				user: address,
				chainId:
					data?.[activeProtocol].versions[activeVersion].chains[activeChain].id
			}),
		{ enabled: isConnected }
	);
}

export function useProtocolMarkets(protocol: string, options: AnyObject = {}) {
	return useQuery([protocol, options.chainId, options.version], () =>
		getLendingProtocolMarkets(protocol, {
			...options
		})
	);
}

export function useNativeTokenUSDValue() {
	const {
		data: { activeChain, activeVersion, activeProtocol }
	} = useData();
	const { data } = useProtocols();
	const { isConnected } = useAccount();

	return useQuery(
		[
			"native-token-usd-value",
			data[activeProtocol].versions[activeVersion].chains[activeChain]
		],
		() =>
			getNativeTokenUSDValue(
				data[activeProtocol].versions[activeVersion].chains[activeChain]
					.nativeToken,
				data[activeProtocol].versions[activeVersion].chains[activeChain].id
			),
		{
			enabled: isConnected,
			refetchOnWindowFocus: false
		}
	);
}

type TUVProps = {
	token: string;
	chainId: number;
	quoteToken: string;
	getTokenUsdValueToken2: string;
	getTokenUsdValueChainId2: number;
};

export function useTokenUSDValues({
	token,
	chainId,
	quoteToken,
	getTokenUsdValueToken2,
	getTokenUsdValueChainId2
}: TUVProps) {
	return useQuery(
		[
			"token-usd-value",
			token,
			chainId,
			quoteToken,
			getTokenUsdValueChainId2,
			getTokenUsdValueToken2
		],
		() =>
			getTokenUSDValue({
				token,
				chainId,
				quoteToken,
				getTokenUsdValueToken2,
				getTokenUsdValueChainId2
			}),
		{
			refetchOnWindowFocus: false
		}
	);
}

type LQProps = {
	slippage: number;
	debtAddress: string;
	collateralAddress: string;
	initialCollateralAmount: number;
	collateralizationRatio: number;
};

export function useLeverageQuote(
	{
		slippage,
		debtAddress,
		collateralAddress,
		initialCollateralAmount,
		collateralizationRatio
	}: LQProps,
	callback: (d: LeverageQuoteInput) => void
) {
	const { data } = useProtocols();
	const { address } = useAccount();
	let control = useRef(new AbortController());
	const {
		data: { activeProtocol, activeChain, activeVersion }
	} = useData();
	const { name, versions = [] } = data[activeProtocol];

	return useQuery(
		[
			"leverage-quote",
			slippage,
			debtAddress,
			collateralAddress,
			collateralizationRatio,
			initialCollateralAmount
		],
		() => {
			control.current.abort();
			control.current = new AbortController();
			return getLeverageQuote({
				user: address,
				protocol: name,
				debt: debtAddress,
				collateralizationRatio,
				collateral: collateralAddress,
				signal: control.current.signal,
				version: versions[activeVersion].name,
				slippage: (slippage / 100) * 1000000,
				initialCollateralAmount: initialCollateralAmount,
				chainId: versions[activeVersion].chains[activeChain].id
			});
		},
		{
			onSuccess: d => {
				callback(d);
			},
			onError(err) {
				console.log(err);
				toast.error("error occured");
			},
			refetchInterval: 10000
		}
	);
}

type LiQProps = {
	amount: number;
	slippage: number;
	assetAddress: string;
	collateralAddress: string;
};

export function useLiquidationQuote(
	{ slippage, assetAddress, collateralAddress, amount }: LiQProps,
	callback: (d: LiquidationQuote) => void
) {
	const { data } = useProtocols();
	const { address } = useAccount();
	let control = useRef(new AbortController());
	const {
		data: { activeProtocol, activeChain, activeVersion }
	} = useData();
	const { name, versions = [] } = data[activeProtocol];

	return useQuery(
		["leverage-quote", amount, slippage, assetAddress, collateralAddress],
		() => {
			control.current.abort();
			control.current = new AbortController();
			return getLiquidation({
				user: address,
				protocol: name,
				debtAmount: amount,
				debt: assetAddress,
				collateral: collateralAddress,
				signal: control.current.signal,
				slippage: (slippage / 100) * 1000000,
				version: versions[activeVersion].name,
				chainId: versions[activeVersion].chains[activeChain].id
			});
		},
		{
			onSuccess: d => {
				callback(d);
			},
			refetchInterval: 10000
		}
	);
}
