// """
// Chain
// Represents a Blockchain
// id: ChainId
// protocols: A list of DeFi protocols on the chain
// contracts: A list of contracts for the protocols
// """

export type Chain = {
	id: number;
	name: string;
	logo: string;
	protocols: Protocol[];
	contracts: Contract[];
};

// """
// Protocol
// Represents a DeFi Protocol
// chains: A list of chains the Protocol is on
// versions: A list of versions of the Protocol that we support
// category: e.g Lending, Exchange...
// """
export type Protocol = {
	name: string;
	description: string;
	logo: string;
	chains: Chain[];
	category: Category[];
	versions: Version[];
};

// """
// Contract
// Represents a Protocol's Smart Contract deployed on a Blockchain
// address: Deployed address
// abi: Methods available on the Contract
// version: Protocol's have different contracts for each version of the Protocol
// """
export type Contract = {
	id: string;
	chain: Chain;
	chains: Chain[];
	protocol: Protocol;
	protocolName: string;
	version: Version;
	versionName: string;
	address: string;
	function: string;
	abi: string;
	name: string;
};

// """
// Category
// The category of a Defi Protocol
// """
export type Category = {
	name: string;
	protocols: Protocol[];
};

// """
// Version
// Represents a version of a Protocol
// Helps seperate contracts number;o different versions
// """
export type Version = {
	name: string;
	protocol: Protocol;
	protocolName: string;
	contracts: Contract[];
};

// """
// LendingMarket
// A Deposit/Borrow market on a LendingProtocol(Protocol with Category=Lending)
// Basically, each Market wraps around a token (crypto currency)
// We represent Market as the underlying token, irrespective of the Protocol's logic

// address: address of the token
// protocol: name of the protocol
// version: version of the market
// totalAvailable: total amount available for borrowing
// totalBorrowed: total amount borrowed
// totalSupplied: total amount supplied (totalAvailable+totalBorrowed)
// total...USD: equivalent value in US Dollars
// """
export type LendingMarket = {
	address: string;
	protocol: string;
	version: string;
	name: string;
	symbol: string;
	logo: string;
	totalAvailable: number;
	totalSupplied: number;
	totalBorrowed: number;
	totalAvailableUSD: number;
	totalSuppliedUSD: number;
	totalBorrowedUSD: number;
};

// """
// LendingMarketUser
// LendingMarket with info for a particular User (Address)

// user: address
// marketAddress: Market.address
// amountSupplied: Amount of underlying supplied by user
// amountBorrowed: Amount of underlying borrowed by user
// amount...USD: US Dollar value
// usageAsCollateralEnabled: A boolean; that tells us if the users deposit in this Market is a collateral
// """
export type LendingMarketUser = {
	user: string;
	marketAddress: string;
	marketName: string;
	marketSymbol: string;
	marketLogo: string;
	amountSupplied: number;
	amountBorrowed: number;
	amountSuppliedUSD: number;
	amountBorrowedUSD: number;
	depositAPY: number;
	borrowAPY: number;
	usageAsCollateralEnabled: boolean;
};

// """
// LendingProtocolUserData

// Represents the User data for a particular Protocol

// user: Address
// totalSuppliedUSD: total amount currently supplied by the user in USD
// totalBorrowsUSD: total amount currently borrowed by the user in USD
// availableBorrowsUSD: borrowing capacity of the user
// healthFactor: a number that represents the health of a user. < 1 = liquidation
// markets: LendingMarketUser[]
// """
export type LendingProtocolUserData = {
	user: string;
	protocol: string;
	version: string;
	totalSuppliedUSD: number;
	totalBorrowedUSD: number;
	availableBorrowsUSD: number;
	healthFactor: number;
	markets: LendingMarketUser[];
	type: string;
};

// """ExchangeUserData"""
export type ExchangeUserData = {
	user: string;
	protocol: string;
	version: string;
	type: string;
};

export type UserData = LendingProtocolUserData & ExchangeUserData;

// """
// Error

// Represent an execution error
// error: export type of error
// reason: cause of error
// """
export type Error = {
	error: string;
	reason: string;
};

// """
// Tx
// Represent's a Transaction (excluding nonce, gasPrice...)

// from: sender's address
// to: receipient address
// data: encoded data that represent's an action
// error: represents an execution error
// """
export type Tx = {
	from: string;
	to: string;
	data: string;
	error: string;
};

// """
// SwapPath

// Represents a single path for a swap
// tokenIn: input token
// tokenOut: output token
// pool: Liquidity Pool for the swap
// """
export type SwapPath = {
	tokenIn: string;
	tokenOut: string;
	pool: string;
};

// """SwapPath - input"""
export type SwapPathInput = {
	tokenIn: string;
	tokenOut: string;
	pool: string;
};

// """
// SwapQuote

// A swap Quote that can be used to generate a Tx
// tokenIn: input token
// tokenOut: output token
// amountIn: amount of tokenIn
// amountOut: amount of tokenOut
// path: SwapPath[[]  paths required for the swap
// priceImpact: Impact of the swap on the price of tokenIn and tokenOut (and all other tokens in the path)
// """
export type SwapQuote = {
	tokenIn: string;
	tokenOut: string;
	amountIn: number;
	amountOut: number;
	path: SwapPath[];
	priceImpact: number;
};

export type SwapQuoteInput = {
	tokenIn: string;
	tokenOut: string;
	amountIn: number;
	amountOut: number;
	path: SwapPathInput[];
	priceImpact: number;
};

// """
// LiquidationQuote
// A liquidation Quote that can be used to generate a liquidation Tx

// canLiquidate: specifies if liquidation can occur
// reason: null if canLiquidate, gives reason why liquidation cannot occur
// debt: Token address of debt
// collateral: Token address of collateral
// debtAmount: amount of debt to be repaid
// collateralAmount: amount of collateral to be liquidated
// swapQuote: swapQuote for the liquidation
// fee: protocol fee
// slippage: estimated difference between the swapQuote amount out and actual amount out
// """
export type LiquidationQuote = {
	fee: number;
	debt: string;
	reason: string;
	slippage: number;
	collateral: string;
	debtAmount: number;
	swapQuote: SwapQuote;
	debtAmountUSD: number;
	canLiquidate: boolean;
	collateralAmount: number;
	collateralAmountUSD: number;
};

export type LiquidationQuoteInput = {
	canLiquidate: boolean;
	reason: string;
	debt: string;
	collateral: string;
	debtAmount: number;
	collateralAmount: number;
	swapQuote: SwapQuoteInput;
	fee: number;
	slippage: number;
};

// """
// LiquidationResult

// Result of a liquidation transaction
// """
export type LiquidationResult = {
	error: string;
	success: boolean;
};
