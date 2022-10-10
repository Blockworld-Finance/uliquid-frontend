import { Aave, Dropdown } from "@icons";

export default function BlockChain() {
	return (
		<div>
			<div className="space-y-4">
				<p className="text-[18px] text-darkGrey">Blockchain</p>
				<div className="flex max-w-md py-7 px-8  bg-navy rounded-xl items-center justify-between">
					<div className="flex items-center space-x-4">
						<Aave />
						<p>Ethereum</p>
						<div className="bg-primary text-blue text-sm px-5 py-2 rounded">version 2</div>
					</div>
					<div>
						<Dropdown />
					</div>
				</div>
			</div>
		</div>
	);
}
