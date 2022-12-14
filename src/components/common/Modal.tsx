import { Close } from "@icons";
import { ReactNode, useEffect, useRef } from "react";

type Props = {
	open: boolean;
	children: ReactNode;
	type?: "default" | "dark";
	setOpen: (_v: boolean) => void;
};

export default function Modal({
	open,
	setOpen,
	children,
	type = "default"
}: Props) {
	let timeOut = useRef<NodeJS.Timeout>();
	const bgRef = useRef<HTMLDivElement>(null);
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (modalRef.current && bgRef.current)
			if (!open)
				timeOut.current = setTimeout(() => {
					modalRef.current.style.display = "none";
					bgRef.current.style.display = "none";
				}, 500);
			else {
				if (timeOut.current) clearTimeout(timeOut.current);
				modalRef.current.style.display = "fixed";
				bgRef.current.style.display = "none";
			}
	}, [open]);

	return (
		<>
			<div
				ref={modalRef}
				className={`${
					open ? "opacity-100 scale-100" : "opacity-0 scale-0"
				} h-screen w-screen fixed -translate-x-1/2 left-1/2 -translate-y-1/2 top-1/2 bg-black bg-opacity-60 cursor-pointer`}
				onClick={() => setOpen(false)}
			/>
			<div
				className={`w-full ${
					type === "default"
						? "bg-navy max-w-lg py-10"
						: "bg-primary py-4 md:py-6 max-w-md"
				} rounded-lg fixed ${
					open ? "opacity-100 scale-100" : "opacity-0 scale-50"
				} fixed -translate-x-1/2 left-1/2 -translate-y-1/2 top-1/2 px-4 md:px-6 z-10`}
			>
				<div className="relative">
					<div
						onClick={() => setOpen(false)}
						className="absolute top-0 right-0 cursor-pointer z-50"
					>
						<Close />
					</div>
					<div>{open && children}</div>
				</div>
			</div>
		</>
	);
}
