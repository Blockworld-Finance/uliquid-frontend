import { Version } from "./schema";

export type AppData = {
	activeChain: number;
	activeVersion: number;
	activeProtocol: number;
};

export interface AnyObject<T = any, D = any> extends D {
	[key: string]: T;
}

type GetProtocolResponse = {
	getProtocols: {
		logo: string;
		name: string;
		description: string;
		versions: Version[];
	}[];
};

type NormalizedProtocols = {
	name: string;
	logo: string;
	description: string;
	versions: {
		name: string;
		protocolName: string;
		chains: {
			id: number;
			name: string;
			logo: string;
		}[];
	}[];
}[];
