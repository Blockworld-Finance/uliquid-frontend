import { useFeeData } from "wagmi";

import Assets from "./assets";
import BlockChain from "./blockchain";

export default function MarketPlace() {
	useFeeData();

	return (
		<div className="py-10">
			<BlockChain />
			<Assets />
		</div>
	);
}
