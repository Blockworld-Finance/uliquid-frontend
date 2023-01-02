import { useAccount, useFeeData } from "wagmi";

import Stats from "./stats";
import Assets from "./assets";
import { Search } from "@icons";
import BlockChain from "./blockchain";
import Input from "@components/common/input";

export default function MarketPlace() {
	useFeeData();
	const { isConnected } = useAccount();

	return (
		<div className="py-10">
			<BlockChain />

			<div className="flex items-start md:items-center md:justify-between flex-col md:flex-row">
				<Stats />
				{isConnected && (
					<Input
						className="self-center w-full md:w-fit mb-4 md:mb-0"
						LeadingIcon={() => <Search />}
						placeholder="Search assets"
					/>
				)}
			</div>

			<Assets />
		</div>
	);
}
