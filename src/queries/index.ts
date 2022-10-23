import { gql } from "graphql-request";
import client from "src/utils/client";
import { LendingProtocolUserData } from "src/schema";

export const getProtocols = async () => {
	const query = gql`
		{
			getProtocols {
				name
				description
				logo
				chains {
					id
					name
					logo
				}
				versions {
					protocolName
					name
				}
			}
		}
	`;

	const data = await client.request(query);
	return data;
};

type TUserData = {
	chainId: number;
	address: string;
	version: string;
	protocol: string;
};

export const getUserData = async ({
	address,
	chainId,
	protocol,
	version
}: TUserData) => {
	const query = gql`
		query GetLendingProtocolUserData(
			$user: String!
			$protocol: String!
			$chainId: Int!
			$version: String!
		) {
			getLendingProtocolUserData(
				user: $user
				protocol: $protocol
				chainId: $chainId
				version: $version
			) {
				totalSuppliedUSD
				totalBorrowedUSD
				availableBorrowsUSD
				healthFactor
				user
				protocol
				version
				markets {
					marketLogo
					amountSuppliedUSD
					amountBorrowedUSD
					amountSupplied
					amountBorrowed
					depositAPY
					borrowAPY
					usageAsCollateralEnabled
					marketSymbol
					marketName
					marketAddress
					user
				}
			}
		}
	`;

	console.log(address, chainId, version, protocol);

	const data = await client.request(query, {
		user: address,
		protocol,
		chainId,
		version
	});
	return data as { getLendingProtocolUserData: LendingProtocolUserData };
};
