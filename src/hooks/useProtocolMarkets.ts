import { AnyObject } from "@types";
import { getLendingProtocolMarkets } from "src/queries";
import { useQuery } from "wagmi";

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
