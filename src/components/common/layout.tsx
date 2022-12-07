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
				<Header {...urls} />
				<section className="max-w-[1240px] mx-auto p-4 md:p-0">{children}</section>
			</main>
			<Footer {...urls} />
		</>
	);
}
