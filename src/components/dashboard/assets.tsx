/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useAccount, useFeeData } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
	ChangeEventHandler,
	useCallback,
	useEffect,
	useMemo,
	useState
} from "react";
import { prepareSendTransaction, sendTransaction } from "@wagmi/core";

import {
	LiquidationQuote,
	LendingMarketUser,
	LeverageQuoteInput
} from "src/schema";
import {
	getLendingProtocolLeverageTx,
	getLendingProtocolLiquidateTx
} from "src/queries";
import {
	useUserData,
	useProtocols,
	useProtocolMarkets,
	useNativeTokenUSDValue
} from "src/hooks/useQueries";
import Leverage from "./leverage";
import { Liquidate } from "./liquidate";
import Tabs from "@components/common/tabs";
import { TransactionStatus } from "@types";
import Modal from "@components/common/Modal";
import Button from "@components/common/button";
import { useNavData } from "@hooks/useNavData";
import Spinner from "@components/common/Spinner";
import { formatNumber } from "src/utils/helpers";
import {
	Info,
	Send,
	Wallet,
	Sortable,
	Warning,
	Exclamation,
	Search
} from "@icons";
import Stats from "./stats";
import Input from "@components/common/input";

export default function Assets() {
	useNativeTokenUSDValue();
	const [open, setOpen] = useState(false);
	const [view, setView] = useState(false);
	const [show, setShow] = useState(false);
	const { data, isLoading } = useUserData();
	const { data: protocols } = useProtocols();
	const { isConnected, address } = useAccount();
	const [asset, setAsset] = useState<LendingMarketUser>();
	const [status, setStatus] = useState<TransactionStatus>();
	const { activeChain, activeProtocol, activeVersion } = useNavData();
	const [liquidationInfo, setLiquidationInfo] = useState(<></>);
	const [assetList, setAssetList] = useState(
		data?.getLendingProtocolUserData?.markets ?? []
	);
	const [sortDir, setSortDir] = useState({
		currentSort: "",
		amountSupplied: "asc",
		amountBorrowed: "asc"
	});

	const {
		name = "",
		versions = [],
		categories
	} = protocols[activeProtocol as number];
	useFeeData({
		chainId: versions[activeVersion].chains[activeChain].id
	});
	useProtocolMarkets(name, {
		version: versions[activeVersion].name,
		chainId: versions[activeVersion].chains[activeChain].id
	});

	const defaultCollateral = useMemo(() => {
		if (data) {
			const vals = data.getLendingProtocolUserData.markets.map(
				m => m.amountSupplied
			);
			const max = Math.max(...vals);
			return (
				data.getLendingProtocolUserData.markets.find(
					m => m.amountSupplied === max
				) ?? data.getLendingProtocolUserData.markets[0]
			);
		}
	}, [data]);

	useEffect(() => {
		if (data?.getLendingProtocolUserData?.markets)
			setAssetList(data?.getLendingProtocolUserData?.markets);
	}, [data?.getLendingProtocolUserData?.markets]);

	const sortAssetList = (prop: string, dir: "asc" | "desc") => {
		const cache = data.getLendingProtocolUserData.markets;
		if (dir === "asc")
			setAssetList([...cache.sort((a, b) => a[prop] - b[prop])]);
		if (dir === "desc")
			setAssetList([...cache.sort((a, b) => b[prop] - a[prop])]);
		setSortDir({ ...sortDir, [prop]: dir, currentSort: prop });
	};

	const searchAssets: ChangeEventHandler<HTMLInputElement> = useCallback(
		e => {
			const cache = data.getLendingProtocolUserData.markets.filter(m =>
				m.marketName.toLowerCase().includes(e.target.value.toLowerCase())
			);

			setAssetList(cache);
		},
		[data]
	);

	const getLiquidateTx = (
		liquidationQuote: LiquidationQuote,
		message: JSX.Element
	) => {
		setView(true);
		setOpen(false);
		setLiquidationInfo(message);
		getLendingProtocolLiquidateTx({
			user: address,
			protocol: name,
			liquidationQuote,
			version: versions[activeVersion].name,
			chainId: versions[activeVersion].chains[activeChain].id
		})
			.then(async d => {
				let status: TransactionStatus = "completed";

				for (let tx in d.getLendingProtocolLiquidateTx) {
					try {
						const config = await prepareSendTransaction({
							request: {
								to: d.getLendingProtocolLiquidateTx[tx].to,
								data: d.getLendingProtocolLiquidateTx[tx].data,
								from: d.getLendingProtocolLiquidateTx[tx].from,
								chainId: versions[activeVersion].chains[activeChain].id
							},
							chainId: versions[activeVersion].chains[activeChain].id
						});

						const result = await sendTransaction(config);
						await result.wait();
					} catch (e) {
						console.log(e, e.message, "====> errr");
						if (e.message?.includes("user rejected transaction"))
							status = "rejected";
						else status = "failed";
						break;
					}
				}
				setShow(true);
				setView(false);
				setStatus(status);
			})
			.catch(e => {
				console.log(e);
				setView(false);
			});
	};

	const getLeverageTx = (
		leverageQuote: LeverageQuoteInput,
		message: JSX.Element
	) => {
		setView(true);
		setOpen(false);
		setLiquidationInfo(message);
		getLendingProtocolLeverageTx({
			leverageQuote,
			user: address,
			protocol: name,
			version: versions[activeVersion].name,
			chainId: versions[activeVersion].chains[activeChain].id
		})
			.then(async d => {
				let status: TransactionStatus = "completed";
				for (let tx in d.getLendingProtocolLeverageTx) {
					try {
						const config = await prepareSendTransaction({
							request: {
								gasLimit: 7000000,
								to: d.getLendingProtocolLeverageTx[tx].to,
								data: d.getLendingProtocolLeverageTx[tx].data,
								from: d.getLendingProtocolLeverageTx[tx].from,
								chainId: versions[activeVersion].chains[activeChain].id
							},
							chainId: versions[activeVersion].chains[activeChain].id
						});
						const result = await sendTransaction(config);
						await result.wait();
					} catch (e) {
						console.log(e, e.message, "====> errr");
						if (e.message?.includes("user rejected transaction"))
							status = "rejected";
						else status = "failed";
						break;
					}
				}
				setView(false);
				setShow(true);
				setStatus(status);
			})
			.catch(e => {
				console.log(e);
				setView(false);
			});
	};

	const selectAsset = useCallback((asset: LendingMarketUser) => {
		setOpen(true);
		setAsset(asset);
	}, []);

	return (
		<>
			<div className="flex items-start lg:items-center md:justify-between flex-col lg:flex-row">
				<Stats />
				{isConnected && (
					<Input
						onChange={searchAssets}
						placeholder="Search assets"
						LeadingIcon={() => <Search />}
						className="self-center md:self-auto w-full md:max-w-lg lg:w-fit mb-4 lg:mb-0"
					/>
				)}
			</div>
			<div className="bg-navy p-4 md:p-10 rounded-xl">
				{isConnected ? (
					<div className="space-y-3 md:space-y-6">
						<div className="text-darkGrey">
							<ul className="md:px-8 grid grid-cols-4 md:grid-cols-6 items-center text-xs md:text-base">
								<li className="col-span-2">Asset</li>
								<li className="col-span-1 md:col-span-2 flex space-x-3 pr-1">
									<span>Total supplied</span>
									<div
										className="hidden md:block"
										onClick={() => {
											sortAssetList(
												"amountSupplied",
												sortDir.amountSupplied === "asc" ? "desc" : "asc"
											);
										}}
									>
										<Sortable
											className={`cursor-pointer ${
												sortDir.currentSort === "amountSupplied"
													? `${
															sortDir.amountSupplied === "asc"
																? ""
																: "rotate-180"
													  }`
													: "rotate-0"
											}`}
										/>
									</div>
								</li>
								<li className="col-span-1 md:col-span-2 flex items-center justify-between">
									<div className="flex space-x-3">
										<span className="">Total borrowed</span>
										<div
											className="hidden md:block"
											onClick={() => {
												sortAssetList(
													"amountBorrowed",
													sortDir.amountBorrowed === "asc" ? "desc" : "asc"
												);
											}}
										>
											<Sortable
												className={`cursor-pointer ${
													sortDir.currentSort === "amountBorrowed"
														? `${
																sortDir.amountBorrowed === "asc"
																	? ""
																	: "rotate-180"
														  }`
														: "rotate-0"
												}`}
											/>
										</div>
									</div>
								</li>
							</ul>
						</div>
						{isLoading ? (
							<div className="grid place-items-center py-10">
								<Spinner size={4} />
							</div>
						) : (
							<>
								{assetList.length
									? assetList.map((m, i) => (
											<Asset key={i} setOpen={selectAsset} market={m} />
									  ))
									: !isLoading && (
											<div className="text-center space-y-5 py-24">
												<p className="mb-14 text-2xl text-grey">
													No assets found
												</p>
											</div>
									  )}
							</>
						)}
					</div>
				) : (
					<div className="text-center space-y-5 py-24">
						<Wallet className="mx-auto" />
						<h2 className="font-semibold text-4xl">No wallet found</h2>
						<p className="mb-14 text-2xl text-grey">
							Please connect your wallet to see supplies and borrowings
						</p>
						<span className="mx-auto block w-max">
							<ConnectButton />
						</span>
					</div>
				)}
				<Modal open={view} setOpen={setView} type="dark">
					<Confirmation message={liquidationInfo} />
				</Modal>
				<Modal
					open={show}
					setOpen={v => {
						setShow(v);
						setStatus(undefined);
					}}
					type="dark"
				>
					<Submitted status={status} />
				</Modal>
				<Modal open={open} setOpen={setOpen}>
					<Tabs
						className="py-2"
						data={[
							{
								title: "Liquidate",
								render: (
									<Liquidate
										asset={asset}
										getTx={getLiquidateTx}
										collateral={defaultCollateral}
										key={`${asset?.marketSymbol ?? "NOASSET"}-${open}`}
									/>
								)
							},
							...(categories.Leverage
								? [
										{
											title: "Leverage",
											render: (
												<Leverage
													debt={defaultCollateral}
													getTx={getLeverageTx}
													collateral={asset}
													key={`${
														asset?.marketSymbol ?? "NOASSET"
													}-${open}-lev`}
												/>
											)
										}
								  ]
								: [])
						]}
					/>
				</Modal>
			</div>
		</>
	);
}

type AssetProps = {
	market: LendingMarketUser;
	setOpen: (v: LendingMarketUser) => void;
};

const Asset = ({ market, setOpen }: AssetProps) => {
	return (
		<div
			className="border border-darkGrey rounded-lg p-2 md:px-8 md:py-3 cursor-pointer grid grid-cols-4 md:grid-cols-3"
			onClick={() => setOpen(market)}
		>
			<div className="flex space-x-2 items-center col-span-2 md:col-span-1 flex-grow">
				<img
					className="w-4 h-4 md:w-8 md:h-8"
					src={market.marketLogo ?? ""}
					alt={market.marketName ?? ""}
				/>
				<div className="space-y-1">
					<span className="text-xs md:text-[18px] block whitespace-nowrap truncate">
						{market.marketName}
					</span>
					<span className="text-[10px] md:text-sm text-grey block">
						{market.marketSymbol}
					</span>
				</div>
			</div>
			<div className="space-y-1 flex-shrink">
				<span className="text-xs md:text-[18px] block">
					{market.amountSupplied
						? formatNumber(market.amountSupplied, 7, "toPrecision")
						: 0}
				</span>
				<span className="text-[10px] md:text-sm text-grey block">
					$
					{market.amountSuppliedUSD
						? formatNumber(market.amountSuppliedUSD, 7, "toPrecision")
						: 0}
				</span>
			</div>
			<div className="space-y-1 flex-shrink">
				<span className="text-xs md:text-[18px] block">
					{market.amountBorrowed
						? formatNumber(market.amountBorrowed, 7, "toPrecision")
						: 0}
				</span>
				<span className="text-[10px] md:text-sm text-grey block">
					$
					{market.amountBorrowedUSD
						? formatNumber(market.amountBorrowedUSD, 7, "toPrecision")
						: 0}
				</span>
			</div>
		</div>
	);
};

const Confirmation = ({ message }: { message: JSX.Element }) => {
	return (
		<div className="text-center">
			<Spinner size={4} className="mx-auto mt-3" />
			<h3 className="text-[18px] my-5">Waiting for confirmation</h3>
			{message}
			<div className="flex justify-center items-center space-x-2 mt-6">
				<Info />
				<p className="text-grey">Confirm this transaction in your wallet</p>
			</div>
		</div>
	);
};

type Props = {
	status?: TransactionStatus;
};

const Submitted = ({ status = "completed" }: Props) => {
	return (
		<div className="text-center">
			{status === "completed" && <Send className="mx-auto mt-3" />}
			{status === "rejected" && <Warning className="mx-auto mt-3" />}
			{status === "failed" && <Exclamation className="mx-auto mt-3" />}
			<h3 className="text-[18px] my-5">Transaction {status}</h3>
			<p className="text-grey">
				{status === "completed" &&
					"Click dashboard button below to perform another transaction or return home."}
				{status === "rejected" &&
					"This transaction was declined in your wallet."}
				{status === "failed" &&
					"An error occurred while trying to send your transaction"}
			</p>

			{status === "completed" && (
				<div className="flex justify-center items-center space-x-2 mt-6">
					<Link passHref href={"/"}>
						<a className="px-8 py-4 text-blue">Go home</a>
					</Link>
					<Button>Dashboard</Button>
				</div>
			)}
		</div>
	);
};
