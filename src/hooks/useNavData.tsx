import { useRouter } from "next/router";

export function useNavData() {
	const {
		query: {
			activeChain: ac = 0,
			activeVersion: av = 0,
			activeProtocol: ap = 0
		},
		push
	} = useRouter();

	return {
		push,
		activeChain: Number(ac) ?? 0,
		activeVersion: Number(av) ?? 0,
		activeProtocol: Number(ap) ?? 0
	};
}
