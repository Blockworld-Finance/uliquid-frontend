import Input from "@components/common/input";
import { Search } from "@icons";
import Assets from "./assets";
import BlockChain from "./blockchain";
import Stats from "./stats";

export default function MarketPlace() {
	return (
		<div className="py-10">
			<BlockChain />
			<div className="flex items-center justify-between">
				<Stats />
				<Input className="self-center" LeadingIcon={() => <Search />} placeholder="Search assets" />
			</div>
			<Assets />
		</div>
	);
}
