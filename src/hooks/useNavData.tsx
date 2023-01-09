import { useRouter } from "next/router";
import { useMemo } from "react";
import { removeSpecialChars } from "src/utils/helpers";
import { useProtocols } from "./useQueries";

export function useNavData() {
	const {
		query: {
			activeChain: ac = "",
			activeVersion: av = "",
			activeProtocol: ap = ""
		},
		push
	} = useRouter();
	const { data: protocols } = useProtocols();

	const pathData = useMemo(() => {
		let activeProtocol = protocols.findIndex(
			p => removeSpecialChars(p.name) === ap
		);
		if (activeProtocol === -1) activeProtocol = 0;

		let activeVersion = protocols[activeProtocol].versions.findIndex(
			v => removeSpecialChars(v.name) === av
		);
		if (activeVersion === -1) activeVersion = 0;

		let activeChain = protocols[activeProtocol].versions[
			activeVersion
		].chains.findIndex(c => removeSpecialChars(c.name) === ac);
		if (activeChain === -1) activeChain = 0;

		return { activeChain, activeVersion, activeProtocol };
	}, [ac, av, ap, protocols]);

	return {
		push(protocolIndex: number, versionIndex = 0, chainIndex = 0) {
			push(
				`/dashboard/${removeSpecialChars(
					protocols[protocolIndex].name
				)}/${removeSpecialChars(
					protocols[protocolIndex].versions[versionIndex].name
				)}/${removeSpecialChars(
					protocols[protocolIndex].versions[versionIndex].chains[chainIndex]
						.name
				)}`
			);
		},
		...pathData
	};
}
