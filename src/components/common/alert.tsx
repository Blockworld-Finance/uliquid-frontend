type Props = {
	message: JSX.Element;
};

export default function Alert({ message }: Props) {
	return (
		<div className="text-center bg-red-500 px-2 py-2 rounded">{message}</div>
	);
}
