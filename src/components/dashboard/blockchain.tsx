import Image from "next/image";
import { useState } from "react";
import { Dropdown } from "@icons";
import useData from "src/hooks/useData";
import { useProtocols } from "src/hooks/useQueries";
import { ClickOutside } from "src/hooks/useClickOutside";

export default function BlockChain() {
	const {
		data: { activeProtocol, activeChain, activeVersion }
	} = useData();
	const [open, setOpen] = useState(false);
	const { data } = useProtocols();
	const { versions = [], name } = data[activeProtocol];

	return (
		<div>
			<div className="space-y-4">
				<p className="text-[18px] text-darkGrey">Blockchain</p>
				<div className="flex max-w-md py-7 px-8 bg-navy rounded-xl items-center justify-between">
					<div className="flex items-center space-x-4">
						<Image
							width={32}
							height={32}
							src={
								data[activeProtocol].versions[activeVersion].chains[activeChain]
									?.logo ?? ""
							}
							alt={
								data[activeProtocol].versions[activeVersion].chains[activeChain]
									?.name ?? ""
							}
						/>
						<p>
							{data[activeProtocol].versions[activeVersion].chains[activeChain]
								?.name ?? ""}
						</p>
						{versions && versions.length ? (
							<div className="bg-primary text-blue text-sm px-5 py-2 rounded">
								{versions[activeVersion].name}
							</div>
						) : (
							<></>
						)}
					</div>
					<div className="relative">
						<ClickOutside
							onclickoutside={() => {
								setOpen(false);
							}}
						>
							<div
								className="w-8 h-8 grid place-content-center cursor-pointer"
								onClick={() => setOpen(true)}
							>
								<Dropdown />
							</div>
							<Selector open={open} close={() => setOpen(false)} />
						</ClickOutside>
					</div>
				</div>
			</div>
		</div>
	);
}

type SelectorProps = {
	open: boolean;
	close: () => void;
};

const Selector = ({ open, close }: SelectorProps) => {
	const {
		dispatch,
		data: { activeVersion, activeChain, activeProtocol }
	} = useData();
	const { data } = useProtocols();

	return (
		<div
			className={`absolute right-0 px-10 bg-navy rounded-xl space-y-4 shadow-2xl min-w-[320px] ${
				open ? "py-10 top-8 opacity-100" : "h-0 py-0 top-0 opacity-0"
			} overflow-hidden`}
		>
			<h4 className="font-semibold text-darkGrey">
				Select {data[activeProtocol].name} Market
			</h4>
			<div>
				<small className="text-xs text-grey">Versions</small>
				<div className="flex space-x-2">
					{data[activeProtocol].versions.map((v, i) => (
						<div
							key={`${v.name}-${i}-${activeProtocol}`}
							className={`${
								activeVersion === i
									? "text-primary bg-blue"
									: "bg-primary text-blue"
							} text-sm px-5 py-2 rounded cursor-pointer`}
							onClick={() => {
								dispatch({ activeVersion: i, activeChain: 0 });
							}}
						>
							{v.name}
						</div>
					))}
				</div>
			</div>
			<div className="space-y-6">
				{data[activeProtocol].versions[activeVersion].chains.map((c, i) => (
					<div
						key={`${c.name}-${i}-${activeVersion}`}
						className={`flex text-grey space-x-4 cursor-pointer ${
							activeChain === i ? "text-blue" : ""
						}`}
						onClick={() => {
							close();
							dispatch({ activeChain: i });
						}}
					>
						<Image
							width={24}
							height={24}
							src={c.logo ?? ""}
							alt={c.name ?? ""}
						/>
						<p>{c.name ?? ""}</p>
					</div>
				))}
			</div>
		</div>
	);
};
