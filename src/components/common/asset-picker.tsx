import { useUserData } from "@hooks/useQueries";
import { Search } from "@icons";
import { LendingMarketUser } from "@schema";
import Image from "next/image";
import { ChangeEventHandler, useCallback, useRef, useState } from "react";
import Input from "./input";

type AssetPickerProps = {
	open: boolean;
	close: () => void;
	select: (_m: LendingMarketUser) => void;
};

export const AssetPicker = ({ open, close, select }: AssetPickerProps) => {
	const { data } = useUserData();
	const inputRef = useRef<HTMLInputElement>(null);

	const [list, setList] = useState(
		data?.getLendingProtocolUserData?.markets ?? []
	);

	const searchMarkets: ChangeEventHandler<HTMLInputElement> = useCallback(
		e => {
			const value = e.target.value?.toLowerCase() ?? "";

			const cache = data?.getLendingProtocolUserData?.markets.filter(
				m =>
					m.marketName.toLowerCase().includes(value.toLowerCase()) ||
					m.marketSymbol.toLowerCase().includes(value.toLowerCase()) ||
					m.marketAddress.toLowerCase().includes(value.toLowerCase())
			);

			setList(cache);
		},
		[data]
	);

	return (
		<div
			className={`absolute bg-navy w-72 rounded-lg shadow-2xl right-4 p-4 z-50 overflow-hidden ${
				open ? "py-4 opacity-100 h-[344px]" : "h-0 py-0 opacity-0"
			}`}
		>
			<div className="space-y-3">
				<h4 className="text-sm font-medium text-darkGrey">Change Asset</h4>
				<Input
					innerRef={inputRef}
					onChange={searchMarkets}
					LeadingIcon={() => <Search />}
					placeholder="Search assets or paste address"
					className="self-center border border-darkGrey rounded"
				/>
			</div>
			<div className="mt-6">
				<div className="space-y-3 h-52 overflow-y-scroll overscroll-contain">
					{list.map((m, i) => (
						<div
							key={i}
							className="flex items-center space-x-3 cursor-pointer"
							onClick={() => {
								if (inputRef.current) inputRef.current.value = "";
								select(m);
								close();
							}}
						>
							<div>
								<Image
									width={24}
									height={24}
									src={m.marketLogo ?? ""}
									alt={m.marketName ?? ""}
								/>
							</div>
							<div>
								<h4 className="text-base leading-5 text-grey">
									{m.marketName}
								</h4>
								<small className="text-xs text-darkGrey">
									{m.marketSymbol}
								</small>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
