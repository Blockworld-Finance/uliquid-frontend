import Image from "next/image";
import { Discord, Github, Twitter } from "@icons";
import { TGetURLsResponse } from "src/queries";
import Link from "next/link";

export default function Footer({
	getURLs: { twitter, github, discord, documentation }
}: TGetURLsResponse) {
	return (
		<footer className="bg-navy h-80 flex justify-center">
			<div className="flex items-center justify-between w-full max-w-[1240px] mx-auto">
				<Image src="/logo.svg" alt="Logo" width={185} height={108} />
				<ul className="menu flex items-center justify-between space-x-10 text-[18px] leading-6 text-grey">
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
					<a href="#">
						<Image
							id="badge-button"
							width={"240px"}
							height={"53px"}
							// @ts-ignore
							onClick={() => logBadgeClick()}
							src="https://static.alchemyapi.io/images/marketing/badge.png"
							alt="Alchemy Supercharged"
						/>
					</a>
				</div>
			</div>
		</footer>
	);
}
