/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useAccount, useDisconnect, useNetwork } from "wagmi";

import { Copy, Dropdown, Logout } from "@icons";
import { ClickOutside } from "@hooks/useClickOutside";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { copyTextToClipboard } from "src/utils/helpers";

export const CustomConnectButton = () => {
	const { address } = useAccount();
	const { chain: currentChain } = useNetwork();
	const { disconnect } = useDisconnect();
	const [open, setOpen] = useState(false);

	return (
		<ConnectButton.Custom>
			{({
				chain,
				account,
				mounted,
				openChainModal,
				openConnectModal,
				authenticationStatus
			}) => {
				// Note: If your app doesn't use authentication, you
				// can remove all 'authenticationStatus' checks
				const ready = mounted && authenticationStatus !== "loading";
				const connected =
					ready &&
					account &&
					chain &&
					(!authenticationStatus || authenticationStatus === "authenticated");

				return (
					<div
						{...(!ready && {
							"aria-hidden": true,
							style: {
								opacity: 0,
								pointerEvents: "none",
								userSelect: "none"
							}
						})}
					>
						{(() => {
							if (!connected) {
								return (
									<button
										onClick={openConnectModal}
										type="button"
										className="bg-white text-navy leading-6 py-3 px-4 rounded-md"
									>
										Connect Wallet
									</button>
								);
							}

							if (chain.unsupported) {
								return (
									<button onClick={openChainModal} type="button">
										Wrong network
									</button>
								);
							}

							return (
								<div>
									<div
										onClick={() => setOpen(true)}
										style={{ display: "flex", gap: 12 }}
										className="items-center bg-navy leading-6 py-3 px-4 rounded-md"
									>
										{chain.hasIcon && (
											<div
												style={{
													background: chain.iconBackground,
													width: 16,
													height: 16,
													borderRadius: 999,
													overflow: "hidden",
													marginRight: 4
												}}
											>
												{chain.iconUrl && (
													<img
														src={chain.iconUrl}
														alt={chain.name ?? "Chain icon"}
														style={{ width: 16, height: 16 }}
													/>
												)}
											</div>
										)}
										<span>{account.displayName}</span>
										<Dropdown />
									</div>
									<ClickOutside
										className={`absolute bg-primary rounded-md py-3 px-4 space-y-2 ${
											open ? "block" : "hidden"
										}`}
										onclickoutside={() => {
											setOpen(false);
										}}
									>
										<div className="flex items-center space-x-2">
											{chain.hasIcon && (
												<div
													style={{
														background: chain.iconBackground,
														width: 16,
														height: 16,
														borderRadius: 999,
														overflow: "hidden",
														marginRight: 4
													}}
												>
													{chain.iconUrl && (
														<img
															src={chain.iconUrl}
															alt={chain.name ?? "Chain icon"}
															style={{ width: 16, height: 16 }}
														/>
													)}
												</div>
											)}
											<span>{account.displayName}</span>
										</div>

										<div>
											<span className="text-xs text-darkGrey">Network</span>
											<p>{chain.name}</p>
										</div>
										<hr className="border-navy" />
										<ul className="space-y-2">
											<li
												className="cursor-pointer flex items-center space-x-2"
												onClick={() => {
													copyTextToClipboard(address);
												}}
											>
												<Copy />
												<span>Copy address</span>
											</li>
											<li className="cursor-pointer">
												<a
													target={"_blank"}
													rel="noopener noreferrer"
													className=" flex items-center space-x-2"
													href={`${currentChain?.blockExplorers?.default?.url}/address/${address}`}
												>
													<Copy />
													<span>View on explorer</span>
												</a>
											</li>
											<li
												className="cursor-pointer flex items-center space-x-2"
												onClick={() => {
													disconnect();
												}}
											>
												<Logout />
												<span>Disconnect wallet</span>
											</li>
										</ul>
									</ClickOutside>
								</div>
							);
						})()}
					</div>
				);
			}}
		</ConnectButton.Custom>
	);
};
