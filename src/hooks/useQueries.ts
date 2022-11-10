import { useAccount } from "wagmi";
import { useQuery } from "react-query";

import useData from "./useData";
import { getProtocols, getUserData } from "src/queries";
import { AnyObject, NormalizedProtocols } from "@types";

export function useProtocols(data?: NormalizedProtocols) {
	return useQuery(["protocols"], getProtocols, {
		...(data && { initialData: data })
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
