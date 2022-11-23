import { NormalizedProtocols } from "@types";
import ProtocolCard from "./ProtocolCard";

const protocols = Array(8).fill(0);

type Props = {
	protocols: NormalizedProtocols;
};

export default function Protocols({ protocols }: Props) {
	return (
		<div className="space-y-16 my-6">
			<div className="space-y-4">
				<h1 className="text-6xl leading-tight">Protocols</h1>
				<p className="text-3xl text-grey leading-10">Your lending protocols</p>
			</div>
			<div className="grid grid-cols-4 gap-4">
				{protocols.map((protocol, i) => (
					<ProtocolCard key={i} protocol={protocol} />
				))}
			</div>
		</div>
	);
}
