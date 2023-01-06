const types = {
	error: "bg-red-500",
	warning: "border border-red-500 "
};
type Props = {
	type?: "error" | "warning";
	message: JSX.Element;
};

export default function Alert({ message, type = "error" }: Props) {
	return (
		<div className={`text-center ${types[type]} px-2 py-2 rounded`}>
			{message}
		</div>
	);
}
