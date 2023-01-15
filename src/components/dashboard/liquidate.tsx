/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import { useRef, useState, useMemo } from "react";
import { useFeeData, useNetwork, useSwitchNetwork } from "wagmi";

import {
	useProtocols,
	useTokenBalance,
	useTokenUSDValues,
	useLiquidationQuote,
	useNativeTokenUSDValue
} from "@hooks/useQueries";
import Alert from "@components/common/alert";
import { useNavData } from "@hooks/useNavData";
import Button from "@components/common/button";
import { formatNumber } from "src/utils/helpers";
import { Info, GasPump, Dropdown } from "@icons";
import Spinner from "@components/common/Spinner";
import { ClickOutside } from "@hooks/useClickOutside";
import { AssetPicker } from "@components/common/asset-picker";
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
	const { data } = useProtocols();
	const { chain } = useNetwork();
	const [open, setOpen] = useState(false);
	const [view, setView] = useState(false);
	const [show, setShow] = useState(false);
	const [gasPrice, setGasPrice] = useState(0);
	const { data: balance } = useTokenBalance();
	const [slippage, setSlippage] = useState(1.0);
	const [amount, setAmount] = useState<number>();
	const inputRef = useRef<HTMLInputElement>(null);
	const [asset, setAsset] = useState(initialAsset);
	const { chains, switchNetwork } = useSwitchNetwork();
	const [isInputValid, setInputValid] = useState(false);
	const [isConfirming, setIsConfirming] = useState(false);
	const { data: usdValue, isLoading: nativeTokenLoading } =
		useNativeTokenUSDValue();
	const { activeChain, activeProtocol, activeVersion } = useNavData();
	const { name, logo, versions = [] } = data[activeProtocol];
	const { data: fees, isLoading: feeLoading } = useFeeData({
		chainId: versions[activeVersion].chains[activeChain].id
	});
	const [changeSlippage, setChangeSlippage] = useState(false);
	const [collateral, setCollateral] = useState(initialCollateral);

	const { data: tokenValue, isLoading: tokenLoading } = useTokenUSDValues({
		token: asset?.marketAddress,
		quoteToken: collateral?.marketAddress,
		getTokenUsdValueToken2: collateral?.marketAddress,
		chainId: versions[activeVersion].chains[activeChain].id,
		getTokenUsdValueChainId2: versions[activeVersion].chains[activeChain].id
	});

	const preparing = useMemo(() => {
		console.log(tokenLoading, nativeTokenLoading, feeLoading);

		return tokenLoading || nativeTokenLoading || feeLoading;
	}, [tokenLoading, nativeTokenLoading, feeLoading]);

	const {
		data: liquidation,
		isLoading,
		isRefetching
	} = useLiquidationQuote(
		{
			slippage,
			amount: amount ?? 0,
			assetAddress: asset?.marketAddress,
			collateralAddress: collateral.marketAddress
		},
		(d: LiquidationQuote) => {
			const amount = Number(inputRef.current?.value ?? 0) ?? 0;
			setGasPrice(
				(Number(fees?.gasPrice._hex) * 2000000 * usdValue.getTokenUSDValue) /
					10 ** 18
			);
			
			setInputValid(
				amount &&
					amount  <= asset.amountBorrowed &&  //amount <= balance[collateral.marketAddress] &&
					d.collateralAmount <= collateral.amountSupplied 
					//asset.marketAddress !== collateral.marketAddress
			);
		}
	);



	return preparing ? (
		<div className="my-8 flex justify-center items-center">
			<Spinner size={3} />
		</div>
	) : (
		<>
			<div className="max-h-[60vh] overflow-y-scroll overscroll-y-contain mt-4">
				<div className="flex space-x-10">
					<div className="space-y-2">
						<small className="text-tiny md:text-sm text-darkGrey">
							Protocol
						</small>
						<div className="flex space-x-2 items-center">
							<Image src={logo} alt={name} width={24} height={24} />
							<span className="text-xs md:text-base">{name}</span>
						</div>
					</div>
					<div className="space-y-2">
						<small className="text-tiny md:text-sm text-darkGrey">
							Blockchain
						</small>
						<div className="flex space-x-2 items-center">
							<Image
								width={24}
								height={24}
								src={versions[activeVersion].chains[activeChain]?.logo ?? ""}
								alt={versions[activeVersion].chains[activeChain]?.name ?? ""}
							/>
							<p className="text-xs md:text-base">
								{versions[activeVersion].chains[activeChain]?.name ?? ""}
							</p>
							{versions && versions.length ? (
								<div className="bg-primary text-blue text-tiny md:text-xs px-5 py-1 rounded">
									{versions[activeVersion].name}
								</div>
							) : (
								<></>
							)}
						</div>
					</div>
				</div>

				<div className="space-y-2 my-4">
					{liquidation?.swapQuote?.priceImpact < -5 && (
						<Alert
							message={
								<>
									Price impact warning:{" "}
									{liquidation?.swapQuote?.priceImpact?.toFixed(2) ?? 0}
								</>
							}
						/>
					)}
					{chain?.id !== versions[activeVersion].chains[activeChain].id && (
						<Alert
							message={
								<>
									Please switch to{" "}
									{versions[activeVersion].chains[activeChain].name}.{" "}
									<span
										className="underline cursor-pointer"
										onClick={() => {
											const newChain = chains.find(
												c =>
													c.id ===
													versions[activeVersion].chains[activeChain].id
											);

											console.log(newChain);

											if (newChain) switchNetwork(newChain.id);
											else toast.error("This chain is currently not supported");
										}}
									>
										Switch network
									</span>
								</>
							}
						/>
					)}
					<div className="bg-primary p-2 md:p-3 rounded-lg space-y-3">
						<small className="text-tiny md:text-sm text-darkGrey">Debt</small>
						<div className="grid gap-4 grid-cols-5 space-x-4 items-center">
							<div className="flex-grow border border-darkGrey rounded-lg p-2 md:py-3 md:px-4 col-span-3">
								<input
									step={0.01}
									type="number"
									ref={inputRef}
									value={amount}
									inputMode="numeric"
									onChange={e => {
										if (e.target.value) setAmount(Number(e.target.value));
										else setAmount(undefined);
									}}
									className="w-full text-xs md:text-3xl text-white bg-primary border-none focus:outline-none"
								/>
								<small className="text-tiny md:text-sm text-grey">
									${formatNumber(liquidation?.debtAmountUSD) ?? 0}
								</small>
							</div>
							<div className="space-y-2 col-span-2">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-2 flex-initial">
										<img
											className="w-6 md:w-8 h-6 md:h-8"
											src={asset?.marketLogo ?? ""}
											alt={asset?.marketName ?? ""}
										/>
										<span className="text-xs md:text-base">
											{asset?.marketSymbol}
										</span>
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
								<small className="text-tiny md:text-sm text-grey flex items-center justify-between">
									<span>
										Debt = {asset?.amountBorrowed.toPrecision(6) ?? 0}
									</span>
									<span
										className="px-1 py-[2px] bg-[#008DE4] rounded-full text-white cursor-pointer"
										onClick={() => {
											setAmount(asset.amountBorrowed);
										}}
									>
										Max
									</span>
								</small>
							</div>
						</div>
					</div>

					<div className="bg-primary p-3 rounded-lg space-y-3">
						<small className="text-tiny md:text-sm text-darkGrey">
							Collateral
						</small>
						<div className="grid gap-4 grid-cols-5 space-x-4 items-center">
							<div className="flex-grow border border-darkGrey rounded-lg py-3 px-4 col-span-3">
								<input
									readOnly
									value={formatNumber(liquidation?.collateralAmount) ?? 0}
									className="w-full text-xs md:text-3xl text-white bg-primary border-none focus:outline-none"
								/>
								<small className="text-tiny md:text-sm text-grey">
									${formatNumber(liquidation?.collateralAmountUSD) ?? 0}
								</small>
							</div>
							<div className="space-y-2 col-span-2">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-2">
										<img
											className="w-6 md:w-8 h-6 md:h-8"
											src={collateral?.marketLogo ?? ""}
											alt={collateral?.marketName ?? ""}
										/>
										<span className="text-xs md:text-base">
											{collateral?.marketSymbol}
										</span>
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
								<small className="text-tiny md:text-sm text-grey">
									Bal = {collateral?.amountSupplied.toPrecision(8) ?? 0}
								</small>
							</div>
						</div>
					</div>

					<div className="bg-primary p-3 rounded-lg text-xs md:text-base">
						<div className="flex justify-between items-center text-grey text-sm">
							<div className="flex space-x-2 items-center">
								<div id="info">
									<Info />
								</div>
								<Tooltip anchorId="info" place="top">
									<div className="max-w-[200px]">
										The amount of collateral liquidated is calculated using this
										exchange rate plus protocol fee.
									</div>
								</Tooltip>
								<span>
									1{asset?.marketSymbol} ={" "}
									{formatNumber(tokenValue?.getTokenValue) ?? 0}
									{collateral?.marketSymbol} ($
									{formatNumber(
										(tokenValue?.getTokenValue ?? 0) *
											tokenValue?.getTokenUSDValue ?? 0
									)}
									)
								</span>
							</div>

							<div className="flex space-x-2 items-center">
								<GasPump />
								<span>${gasPrice.toFixed(4)}</span>
								{liquidation && <Dropdown onClick={() => setShow(!show)} />}
							</div>
						</div>
						<div
							className={`${
								show ? "h-min space-y-2 mt-3" : "h-0"
							} overflow-y-hidden`}
						>
							<div className="flex justify-between items-center">
								<h3 className="text-grey">Repaid debt</h3>
								<h3>
									{formatNumber(liquidation?.debtAmount) ?? 0}{" "}
									{asset?.marketSymbol ?? ""}
								</h3>
							</div>
							<div className="flex justify-between items-center">
								<h3 className="text-grey">Price impact</h3>
								<h3
									className={`${
										liquidation?.swapQuote?.priceImpact < -5
											? "text-red-500"
											: ""
									}`}
								>
									{liquidation?.swapQuote?.priceImpact?.toFixed(2) ?? 0}%
								</h3>
							</div>
							<div className="flex justify-between items-start text-grey">
								<div>
									<p>Maximum spent after slippage</p>
									{changeSlippage ? (
										<ClickOutside
											className="space-x-2"
											onclickoutside={() => setChangeSlippage(false)}
										>
											<Button
												size="default"
												onClick={() => {
													setSlippage(1.0);
													setChangeSlippage(false);
												}}
												className="rounded-full !text-xs !leading-3 !py-2 h-auto"
											>
												Auto
											</Button>
											<input
												max={10}
												min={0.1}
												step={0.5}
												type={"number"}
												inputMode={"numeric"}
												style={{
													appearance: "textfield"
												}}
												value={slippage}
												onChange={e => {
													if (Number(e.target.value) < 0.1) {
														setSlippage(0.1);
														return;
													}
													if (Number(e.target.value) > 10) {
														setSlippage(10);
														return;
													}
													setSlippage(Number(e.target.value));
												}}
												className="text-xs text-right text-white rounded-full border border-darkGrey p-1 bg-transparent"
											/>
										</ClickOutside>
									) : (
										<div className="space-x-2">
											<span>({slippage}%)</span>
											<Button
												size="default"
												onClick={() => {
													setChangeSlippage(!changeSlippage);
												}}
												className="rounded-full !text-xs !leading-3 !py-2 h-auto"
											>
												Change
											</Button>
										</div>
									)}
								</div>
								<p>
									{liquidation?.collateralAmount ?? 0}{" "}
									{collateral?.marketSymbol}
								</p>
							</div>
							<div className="flex justify-between items-center text-grey">
								<p>Network fee</p>
								<p>${gasPrice.toFixed(4)}</p>
							</div>
							<div className="flex justify-between items-center">
								<p>Protocol fee</p>
								<p>{(liquidation?.fee / 1000000) * 100 ?? 0} %</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Button
				size="large"
				loading={isLoading || isRefetching}
				disabled={!isInputValid || chain?.id !== versions[activeVersion].chains[activeChain].id}
				className="w-full font-semibold"
				onClick={() => {
					if (!isConfirming) {
						setIsConfirming(true);
						setShow(true);
						return;
					}

					getTx(
						liquidation,
						<>
							<p className="text-grey">
								Liquidating {liquidation.collateralAmount} {" "}
								{collateral.marketSymbol} to repay {liquidation.debtAmount} {" "}
								{asset.marketSymbol}
								<br />
								Protocol fee of {(liquidation?.fee / 1000000) * 100 ?? 0} {" "}
								included
							</p>
						</>
					);
				}}
			>
				Liquidate
			</Button>
		</>
	);
}
