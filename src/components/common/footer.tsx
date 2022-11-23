import Image from "next/image";
import { Discord, Github, Twitter } from "@icons";
import { TGetURLsResponse } from "src/queries";

export default function Footer({
	getURLs: { twitter, github, discord }
}: TGetURLsResponse) {
	return (
		<footer className="bg-navy h-80 flex justify-center">
			<div className="flex items-center justify-between w-full max-w-[1240px] mx-auto">
				<Image src="/logo.svg" alt="Logo" width={185} height={108} />
				<ul className="flex items-center justify-between space-x-10 text-[18px] leading-6 text-grey">
					<li>Home</li>
					<li>Dashboard</li>
					<li>Docs</li>
					<li>FAQs</li>
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
				</div>
			</div>
		</footer>
	);
}
