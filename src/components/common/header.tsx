import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import { TGetURLsResponse } from "src/queries";
import { useNavData } from "@hooks/useNavData";
import { ClickOutside } from "@hooks/useClickOutside";
import { CustomConnectButton } from "./connect-button";
import { Close, Discord, Github, Menu, Twitter } from "@icons";
import { useRouter } from "next/router";

export default function Header({
	getURLs: { twitter, github, discord, documentation }
}: TGetURLsResponse) {
	const { push } = useNavData();
	const { pathname } = useRouter();
	const [open, setOpen] = useState(false);

	return (
		<>
			<header className="p-4 hidden md:block">
				<div className="flex items-center justify-between max-w-[1240px] mx-auto">
					<Link href={"/"}>
						<Image src="/logo.svg" alt="Logo" width={120} height={56} />
					</Link>
					<ul className="menu flex items-center justify-between space-x-10 text-[18px] leading-6 text-grey">
						<Link href={"/"}>
							<li className={`${pathname === "/" ? "text-blue" : ""}`}>Home</li>
						</Link>
						<li
							className={`cursor-pointer ${
								pathname.includes("dashboard") ? "text-blue" : ""
							}`}
							onClick={() => push(0)}
						>
							Dashboard
						</li>
						<a href={documentation} target="_blank" rel="noopener noreferrer">
							<li>Docs</li>
						</a>
						<Link href="/#faqs">
							<li>FAQs</li>
						</Link>
					</ul>
					<CustomConnectButton />
				</div>
			</header>
			<header className="p-4 md:hidden block">
				<div className="flex items-center justify-between w-full mx-auto">
					<Image src="/logo.svg" alt="Logo" width={80} height={48} />
					<div className="flex items-center space-x-4">
						<CustomConnectButton />
						<span
							className="relative"
							onClick={() => {
								setOpen(!open);
							}}
						>
							{open && (
								<div className="bg-black bg-opacity-60 cursor-pointer w-screen h-screen fixed top-0 left-0" />
							)}
							<span className="relative z-50">
								{open ? <Close /> : <Menu />}
							</span>
							<ClickOutside
								onclickoutside={() => {
									setOpen(false);
								}}
								className={`bg-navy w-min absolute top-10 ${
									open ? "-right-4" : "-right-64"
								} py-10 px-6 space-y-10 rounded-tl-2xl rounded-bl-2xl z-50`}
							>
								<ul className="menu text-[18px] leading-6 text-grey space-y-3">
									<Link href={"/"} className="block">
										<li>Home</li>
									</Link>
									<Link href={"/dashboard"} className="block">
										<li>Dashboard</li>
									</Link>
									<a
										href={documentation}
										className="block"
										target="_blank"
										rel="noopener noreferrer"
									>
										<li>Docs</li>
									</a>
									<a href="#faqs" className="block">
										<li>FAQs</li>
									</a>
								</ul>

								<div className="flex items-center space-x-4">
									<a href={twitter} target="_blank" rel="noopener noreferrer">
										<Twitter />
									</a>
									<a href={github} target="_blank" rel="noopener noreferrer">
										<Github />
									</a>
									<a href={discord} target="_blank" rel="noopener noreferrer">
										<Discord />
									</a>
								</div>
							</ClickOutside>
						</span>
					</div>
				</div>
			</header>
		</>
	);
}
