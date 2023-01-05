import { useAccount } from "wagmi";
import { useQuery } from "react-query";

import useData from "./useData";
import { AnyObject, NormalizedProtocols } from "@types";
import {
	getUserData,
	getProtocols,
	getTokenBalances,
	getNativeTokenUSDValue,
	getLendingProtocolMarkets,
	getTokenUSDValue
} from "src/queries";

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

export default function useProtocolMarkets(
	protocol: string,
	options: AnyObject = {}
) {
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
	);
}
