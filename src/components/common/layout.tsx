import { ReactNode } from "react";
import { TGetURLsResponse } from "src/queries";
import Footer from "./footer";
import Header from "./header";

type Props = {
	children: ReactNode;
	urls: TGetURLsResponse;
};

export default function Layout({ children, urls }: Props) {
	return (
		<>
			<main className="bg-primary min-h-screen pattern max-w-[1440px] mx-auto">
				<Header docsURL={urls.getURLs.documentation} />
				<section className="max-w-[1240px] mx-auto">{children}</section>
			</main>
			<Footer {...urls} />
		</>
	);
}
