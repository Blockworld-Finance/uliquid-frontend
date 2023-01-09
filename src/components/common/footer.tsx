/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { Discord, Github, Twitter } from "@icons";
import { TGetURLsResponse } from "src/queries";
import Link from "next/link";

export default function Footer({
	getURLs: { twitter, github, discord, documentation }
}: TGetURLsResponse) {
	return (
		<footer className="bg-navy h-80 flex justify-center items-center">
			<div className="flex items-center flex-col md:flex-row justify-between w-full max-w-[1240px] mx-auto space-y-6 md:space-y-0">
				<Link href={"/"}>
					<img src="/logo.svg" alt="Logo" className="w-20 md:w-[185px]" />
				</Link>
				<ul className="menu flex items-center justify-between space-x-6 md:space-x-10 text-xs md:text-[18px] leading-6 text-grey">
					<Link href={"/"}>
						<li>Home</li>
					</Link>
					<Link href={"/dashboard"}>
						<li>Dashboard</li>
					</Link>
					<a href={documentation} target="_blank" rel="noopener noreferrer">
						<li>Docs</li>
					</a>
					<Link href="/#faqs">
						<li>FAQs</li>
					</Link>
					<li>Privacy policy</li>
				</ul>
				<div className="flex items-center flex-col md:flex-row space-x-4 space-y-4 md:space-y-0">
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
					<a href="#">
						<Image
							width={240}
							height={53}
							id="badge-button"
							alt="Alchemy Supercharged"
							// @ts-ignore
							onClick={() => logBadgeClick()}
							src="https://static.alchemyapi.io/images/marketing/badge.png"
						/>
					</a>
				</div>
			</div>
		</footer>
	);
}
