import Assets from "./assets";
import BlockChain from "./blockchain";
import Liquidate from "./liquidate";
import Stats from "./stats";

export default function MarketPlace() {
	return (
		<div className="py-10">
			<BlockChain />
			<Stats />
			<Assets />
			<Liquidate />
		</div>
	);
}
