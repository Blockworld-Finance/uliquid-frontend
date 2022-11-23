import Link from "next/link";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";

type Props = {
	docsURL: string;
};

export default function Header({ docsURL }: Props) {
	return (
		<header className="p-4">
			<div className="flex items-center justify-between max-w-[1240px] mx-auto">
				<Image src="/logo.svg" alt="Logo" width={120} height={56} />
				<ul className="menu flex items-center justify-between space-x-10 text-[18px] leading-6 text-grey">
					<Link href={"/"}>
						<li>Home</li>
					</Link>
					<Link href={"/dashboard"}>
						<li>Dashboard</li>
					</Link>
					<a href={docsURL} target="_blank" rel="noopener noreferrer">
						<li>Docs</li>
					</a>
					<a href="#faqs">
						<li>FAQs</li>
					</a>
				</ul>
				<ConnectButton />
			</div>
		</header>
	);
}
