import { AnyObject } from "@types";
import { useQuery } from "react-query";
import { getProtocols, getUserData } from "src/queries";
import { useAccount } from "wagmi";
import useData from "./useData";

export function useProtocols(data?: AnyObject) {
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

	console.log(address, isConnected);

	return useQuery(
		["user-data", activeProtocol, activeChain, activeVersion],
		() =>
			getUserData({
				address,
				protocol: protocols.getProtocols[activeProtocol].name,
				version:
					protocols.getProtocols[activeProtocol].versions[activeVersion].name,
				chainId: protocols.getProtocols[activeProtocol].chains[activeChain].id
			}),
		{
			enabled: isConnected
		}
	);
}
