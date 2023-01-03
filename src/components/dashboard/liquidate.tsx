import {
	useRef,
	useState,
	useEffect,
	useCallback,
	ChangeEventHandler
} from "react";
import Image from "next/image";
import { useAccount } from "wagmi";

import useData from "@hooks/useData";
import Button from "@components/common/button";
import { Info, GasPump, Dropdown } from "@icons";
import { useProtocols } from "@hooks/useQueries";
import { ClickOutside } from "@hooks/useClickOutside";
import { AssetPicker } from "@components/common/asset-picker";
import { getLiquidation, getTokenUSDValue } from "src/queries";
import { LendingMarketUser, LiquidationQuote } from "src/schema";

type Props = {
	asset?: LendingMarketUser;
	collateral?: LendingMarketUser;
	getTx: (l: LiquidationQuote, _x: any) => void;
};

export function Liquidate({
	getTx,
	asset: initialAsset,
	collateral: initialCollateral
}: Props) {
	const {
		data: { activeProtocol, activeChain, activeVersion }
	} = useData();
	const { data } = useProtocols();
	const { address } = useAccount();
	const interval = useRef<NodeJS.Timer>();
	const [open, setOpen] = useState(false);
	const [view, setView] = useState(false);
	const [show, setShow] = useState(false);
	const [tokenValue, setTokenValue] = useState<{
		getTokenValue: number;
		getTokenUSDValue: number;
	}>();
	const inputRef = useRef<HTMLInputElement>(null);
	const [asset, setAsset] = useState(initialAsset);
	const [isInputValid, setInputValid] = useState(false);
	let { current: control } = useRef(new AbortController());
	const [collateral, setCollateral] = useState(initialCollateral);

	const { name, logo, versions = [] } = data[activeProtocol];
	const [liquidation, setLiquidation] = useState<LiquidationQuote>();

	const pollLiquidationQoute = useCallback(() => {
		const amount = Number(inputRef.current?.value ?? 0) ?? 0;
		setInputValid(amount && amount <= asset?.amountBorrowed);
		getLiquidation({
			user: address,
			protocol: name,
			debtAmount: amount,
			// signal: control.signal,
			debt: asset?.marketAddress,
			slippage: (1 / 100) * 1000000,
			collateral: collateral.marketAddress,
			version: versions[activeVersion].name,
			chainId: versions[activeVersion].chains[activeChain].id
		})
			.then(d => {
				setLiquidation(d);
			})
			.catch(e => {});
	}, [
		name,
		address,
		inputRef,
		versions,
		activeChain,
		activeVersion,
		asset?.marketAddress,
		asset?.amountBorrowed,
		collateral?.marketAddress
	]);

	useEffect(() => {
		if (!interval.current) {
			interval.current = setInterval(() => {
				// pollLiquidationQoute();
			}, 10000);
		}
	}, [pollLiquidationQoute]);

	useEffect(() => {
		if (asset && collateral)
			getTokenUSDValue({
				token: asset?.marketAddress,
				quoteToken: collateral?.marketAddress,
				getTokenUsdValueToken2: collateral?.marketAddress,
				chainId: versions[activeVersion].chains[activeChain].id,
				getTokenUsdValueChainId2: versions[activeVersion].chains[activeChain].id
			}).then(d => {
				setTokenValue(d);
			});
	}, [activeChain, activeVersion, asset, collateral, versions]);

	const getLiquidationQuote: ChangeEventHandler<HTMLInputElement> = useCallback(
		e => {
			if (e.target.value.length) {
				if (Number(e.target.value) <= asset?.amountBorrowed) {
					control.abort();
					setInputValid(true);
					// eslint-disable-next-line react-hooks/exhaustive-deps
					control = new AbortController();
					getLiquidation({
						user: address,
						protocol: name,
						signal: control.signal,
						debt: asset?.marketAddress,
						slippage: (1 / 100) * 1000000,
						debtAmount: Number(e.target.value),
						collateral: collateral.marketAddress,
						version: versions[activeVersion].name,
						chainId: versions[activeVersion].chains[activeChain].id
					})
						.then(d => {
							setLiquidation(d);
						})
						.catch(e => {});
				} else {
					setInputValid(false);
				}
			}
		},
		[asset, collateral, versions, name, address]
	);

	return (
		<>
			<div className="max-h-[60vh] overflow-y-scroll overscroll-y-contain mt-4">
				<div className="flex space-x-10">
					<div className="space-y-2">
						<small className="text-sm text-darkGrey">Protocol</small>
						<div className="flex space-x-2 items-center">
							<Image src={logo} alt={name} width={24} height={24} />
							<span>{name}</span>
						</div>
					</div>
					<div className="space-y-2">
						<small className="text-sm text-darkGrey">Blockchain</small>
						<div className="flex space-x-2 items-center">
							<Image
								width={24}
								height={24}
								src={versions[activeVersion].chains[activeChain]?.logo ?? ""}
								alt={versions[activeVersion].chains[activeChain]?.name ?? ""}
							/>
							<p>{versions[activeVersion].chains[activeChain]?.name ?? ""}</p>
							{versions && versions.length ? (
								<div className="bg-primary text-blue text-xs px-5 py-1 rounded">
									{versions[activeVersion].name}
								</div>
							) : (
								<></>
							)}
						</div>
					</div>
				</div>

				<div className="space-y-2 my-4">
					<div className="bg-primary p-3 rounded-lg space-y-3">
						<small className="text-sm text-darkGrey">Debt</small>
						<div className="grid gap-4 grid-cols-5 space-x-4 items-center">
							<div className="flex-grow border border-darkGrey rounded-lg py-3 px-4 col-span-3">
								<input
									step={0.01}
									type="number"
									ref={inputRef}
									onChange={getLiquidationQuote}
									className="w-full text-3xl text-white bg-primary border-none focus:outline-none"
								/>
								<small className="text-sm text-grey">
									${liquidation?.debtAmountUSD ?? 0}
								</small>
							</div>
							<div className="space-y-2 col-span-2">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-2 flex-initial">
										<Image
											width={32}
											height={32}
											src={asset?.marketLogo ?? ""}
											alt={asset?.marketName ?? ""}
										/>
										<span className="">{asset?.marketSymbol}</span>
									</div>
									<div className="">
										<ClickOutside
											onclickoutside={() => {
												setView(false);
											}}
										>
											<div
												className="w-8 h-8 grid place-content-center cursor-pointer"
												onClick={() => setView(true)}
											>
												<Dropdown />
											</div>
											<AssetPicker
												open={view}
												select={setAsset}
												close={() => setView(false)}
											/>
										</ClickOutside>
									</div>
								</div>
								<small className="text-sm text-grey flex items-center justify-between">
									<span>
										Debt = {asset?.amountBorrowed.toPrecision(6) ?? 0}
									</span>
									<span
										className="px-1 py-[2px] bg-[#008DE4] rounded-full text-white cursor-pointer"
										onClick={() => {
											if (inputRef.current)
												inputRef.current.value = `${asset.amountBorrowed}`;
										}}
									>
										Max
									</span>
								</small>
							</div>
						</div>
					</div>

					<div className="bg-primary p-3 rounded-lg space-y-3">
						<small className="text-sm text-darkGrey">Collateral</small>
						<div className="grid gap-4 grid-cols-5 space-x-4 items-center">
							<div className="flex-grow border border-darkGrey rounded-lg py-3 px-4 col-span-3">
								<input
									readOnly
									value={liquidation?.collateralAmount ?? 0}
									className="w-full text-3xl text-white bg-primary border-none focus:outline-none"
								/>
								<small className="text-sm text-grey">
									${liquidation?.collateralAmountUSD ?? 0}
								</small>
							</div>
							<div className="space-y-2 col-span-2">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-2">
										<Image
											width={32}
											height={32}
											src={collateral?.marketLogo ?? ""}
											alt={collateral?.marketName ?? ""}
										/>
										<span>{collateral?.marketSymbol}</span>
									</div>
									<div className="">
										<ClickOutside
											className=""
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
											<AssetPicker
												open={open}
												select={setCollateral}
												close={() => setOpen(false)}
											/>
										</ClickOutside>
									</div>
								</div>
								<small className="text-sm text-grey">
									Bal = {collateral?.amountSupplied.toPrecision(8) ?? 0}
								</small>
							</div>
						</div>
					</div>

					<div className="bg-primary p-3 rounded-lg">
						<div className="flex justify-between items-center">
							<div className="flex space-x-2 items-center">
								<Info />
								<span>
									1{asset?.marketSymbol} ={" "}
									{tokenValue?.getTokenValue.toPrecision(6) ?? 0}{" "}
									{collateral?.marketSymbol} ($
									{(
										(tokenValue?.getTokenValue ?? 0) *
											tokenValue?.getTokenUSDValue ?? 0
									).toPrecision(6)}
									)
								</span>
							</div>

							<div className="flex space-x-2 items-center">
								<GasPump />
								<span>$0.28</span>
								{liquidation && <Dropdown onClick={() => setShow(!show)} />}
							</div>
						</div>
						<div
							className={`${
								show ? "h-min space-y-2 mt-3" : "h-0"
							} overflow-y-hidden`}
						>
							<div className="flex justify-between items-center">
								<h3 className="text-grey">Expected output</h3>
								<h3> {asset?.marketSymbol ?? ""}</h3>
							</div>
							<div className="flex justify-between items-center">
								<h3 className="text-grey">Price impact</h3>
								<h3>
									{liquidation?.swapQuote.priceImpact > 0.00001
										? liquidation?.swapQuote.priceImpact.toPrecision(8) ?? 0
										: 0}
									%
								</h3>
							</div>
							<div className="flex justify-between items-center text-grey">
								<p>Maximum spent after slippage (0.3%)</p>
								<p>
									{liquidation?.collateralAmount ?? 0}{" "}
									{collateral?.marketSymbol}
								</p>
							</div>
							<div className="flex justify-between items-center text-grey">
								<p>Network fee</p>
								<p>$0.28</p>
							</div>
							<div className="flex justify-between items-center">
								<p>Protocol fee</p>
								<p>{(liquidation?.fee / 1000000) * 100 ?? 0}</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Button
				size="large"
				disabled={!isInputValid}
				className="w-full font-semibold"
				onClick={() =>
					getTx(
						liquidation,
						<p className="text-grey">
							Liquidating {liquidation.collateralAmount}{" "}
							{collateral.marketSymbol} to repay {liquidation.debtAmount}{" "}
							{asset.marketSymbol}
							<br />
							Protocol fee of {(liquidation?.fee / 1000000) * 100 ?? 0} included
						</p>
					)
				}
			>
				Liquidate
			</Button>
		</>
	);
}
