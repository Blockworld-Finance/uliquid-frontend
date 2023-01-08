/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Dropdown } from "@icons";

import { useProtocols } from "src/hooks/useQueries";
import { ClickOutside } from "src/hooks/useClickOutside";
import { useNavData } from "@hooks/useNavData";

export default function BlockChain() {
	const { activeChain, activeProtocol, activeVersion } = useNavData();
	const { data } = useProtocols();
	const [open, setOpen] = useState(false);
	const { versions = [] } = data[activeProtocol];

	return (
		<div>
			<div className="space-y-4">
				<p className="text-xs md:text-[18px] text-darkGrey">Blockchain</p>
				<div className="flex max-w-md p-2 md:p-7 bg-navy rounded-xl items-center justify-between">
					<div className="flex items-center space-x-4 text-sm md:text-base">
						<img
							className="w-4 h-4 md:w-8 md:h-8"
							src={
								data[activeProtocol]?.versions?.[activeVersion]?.chains?.[
									activeChain
								]?.logo ?? ""
							}
							alt={
								data[activeProtocol]?.versions?.[activeVersion]?.chains?.[
									activeChain
								]?.name ?? ""
							}
						/>
						<p>
							{data[activeProtocol]?.versions?.[activeVersion]?.chains?.[
								activeChain
							]?.name ?? ""}
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
							<Selector
								open={open}
								close={() => setOpen(false)}
								key={`${activeProtocol}-${activeVersion}-${activeChain}`}
							/>
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
	const { data } = useProtocols();
	const { activeChain, activeProtocol, activeVersion, push } = useNavData();
	const [chain, setChain] = useState(activeChain);
	const [version, setVersion] = useState(activeVersion);

	return (
		<div
			className={`absolute right-0 px-4 md:px-10 bg-navy rounded-xl space-y-4 shadow-2xl w-min min-w-[240px] md:min-w-[320px] ${
				open ? "py-6 md:py-10 top-8 opacity-100" : "h-0 py-0 top-0 opacity-0"
			} overflow-hidden z-20`}
		>
			<h4 className="text-sm font-semibold text-darkGrey">
				Select {data[activeProtocol].name} Market
			</h4>
			<div>
				<small className="text-xs text-grey">Versions</small>
				<div className="flex space-x-2">
					{data[activeProtocol].versions.map((v, i) => (
						<div
							key={`${v.name}-${i}-${activeProtocol}`}
							className={`${
								version === i ? "text-primary bg-blue" : "bg-primary text-blue"
							} text-sm px-2 md:px-5 py-1 md:py-2 rounded cursor-pointer`}
							onClick={() => {
								setChain(0);
								setVersion(i);
							}}
						>
							{v.name}
						</div>
					))}
				</div>
			</div>
			<div className="space-y-6">
				{data[activeProtocol].versions[version].chains.map((c, i) => (
					<div
						key={`${c.name}-${i}-${version}`}
						className={`flex text-grey space-x-4 cursor-pointer text-xs md:text-base ${
							chain === i ? "text-blue" : ""
						}`}
						onClick={() => {
							close();
							push(`/dashboard/${activeProtocol}/${version}/${i}`);
						}}
					>
						<img
							className="w-4 h-4 md:w-8 md:h-8"
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
