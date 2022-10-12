type Props = {
	size?: number;
	color?: string;
	className?: string;
};

export default function Spinner({ size = 1, className, color = "" }: Props) {
	const sides = 16 * size;

	return (
		<div
			style={{
				width: `${sides}px`,
				height: `${sides}px`,
			}}
			className={`ld-ring dt ${className}`}
		>
			<span
				style={{
					width: `${sides}px`,
					height: `${sides}px`,
					...(color && { borderTopColor: color }),
				}}
			></span>
		</div>
	);
}
