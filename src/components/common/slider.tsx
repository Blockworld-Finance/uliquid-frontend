import RCSlider from "rc-slider";
import useWindowDimensions from "@hooks/useWindowDimensions";

type SliderProps = {
	max: number;
	min?: number;
	value: number;
	color?: string;
	onBlur?: () => void;
	onChange: (_value: number | number[]) => void;
};

export default function Slider({
	max,
	value,
	min = 0,
	onChange,
	color = "#32C1CC",
	onBlur = () => {}
}: SliderProps) {
	const { isMobile } = useWindowDimensions();

	return (
		<RCSlider
			trackStyle={{
				top: "-2px",
				height: "10px",
				background: color,
				borderRadius: "10px",
				position: "relative"
			}}
			railStyle={{
				height: "6px",
				borderRadius: "10px",
				background: "#605D5D"
			}}
			handleStyle={{
				opacity: 1,
				width: "16px",
				height: "16px",
				background: color,
				marginTop: "-15px",
				borderRadius: "12px",
				position: "relative",
				border: "4px #fff solid"
			}}
			min={min}
			max={max}
			value={value}
			onBlur={onBlur}
			onChange={onChange}
		/>
	);
}
