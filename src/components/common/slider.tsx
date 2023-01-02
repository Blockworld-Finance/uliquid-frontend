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
	color="#32C1CC",
	onBlur = () => {}
}: SliderProps) {
	const { isMobile } = useWindowDimensions();

	return (
		<RCSlider
			trackStyle={{
				top: "-2px",
				height: "10px",
				borderRadius: "10px",
				position: "relative",
				background: "#32C1CC"
			}}
			railStyle={{
				height: "6px",
				borderRadius: "10px",
				background: "#605D5D"
			}}
			handleStyle={{
				opacity: 1,
				width: "24px",
				height: "24px",
				border: "6px #fff solid",
				background: "#32C1CC",
				borderRadius: "12px",
				position: "relative",
				marginTop: "-19px"
			}}
			min={min}
			max={max}
			value={value}
			onBlur={onBlur}
			onChange={onChange}
		/>
	);
}
