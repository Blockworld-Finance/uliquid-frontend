/* eslint-disable @next/next/no-img-element */
import { Dropdown } from "@icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const CustomConnectButton = () => {
	return (
		<ConnectButton.Custom>
			{({
				account,
				chain,
				openAccountModal,
				openChainModal,
				openConnectModal,
				authenticationStatus,
				mounted
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
								<div
									onClick={openAccountModal}
									style={{ display: "flex", gap: 12 }}
									className="items-center bg-navy leading-6 py-3 px-4 rounded-md"
								>
									{/* <button
										onClick={openChainModal}
										style={{ display: "flex", alignItems: "center" }}
										type="button"
									>
										{chain.hasIcon && (
											<div
												style={{
													background: chain.iconBackground,
													width: 12,
													height: 12,
													borderRadius: 999,
													overflow: "hidden",
													marginRight: 4
												}}
											>
												{chain.iconUrl && (
													<img
														src={chain.iconUrl}
														alt={chain.name ?? "Chain icon"}
														style={{ width: 12, height: 12 }}
													/>
												)}
											</div>
										)}
										{chain.name}
									</button> */}

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
							);
						})()}
					</div>
				);
			}}
		</ConnectButton.Custom>
	);
};
