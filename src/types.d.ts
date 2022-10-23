export type AppData = {
	activeChain: number;
	activeVersion: number;
	activeProtocol: number;
};

export interface AnyObject<T = any, D = any> extends D {
	[key: string]: T;
}
