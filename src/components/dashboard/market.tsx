import Input from "@components/common/input";
import { Search } from "@icons";
import { useAccount } from "wagmi";
import Assets from "./assets";
import BlockChain from "./blockchain";
import Stats from "./stats";

export default function MarketPlace() {
	const { isConnected } = useAccount();

	return (
		<div className="py-10">
			<BlockChain />
			<div className="flex items-center justify-between">
				<Stats />
				{isConnected && (
					<Input
						className="self-center"
						LeadingIcon={() => <Search />}
						placeholder="Search assets"
					/>
				)}
			</div>
			<Assets />
		</div>
	);
}
