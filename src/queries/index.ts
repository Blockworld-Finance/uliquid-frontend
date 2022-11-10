import { gql } from "graphql-request";
import client from "src/utils/client";
import { LendingProtocolUserData, Version } from "src/schema";
import { GetProtocolResponse, NormalizedProtocols } from "@types";

export const getProtocols = async () => {
	const query = gql`
		{
			getProtocols {
				name
				description
				logo
				versions {
					protocolName
					name
					contracts {
						chain {
							id
							name
							logo
						}
					}
				}
			}
		}
	`;

	const data = (await client.request(query)) as GetProtocolResponse;

	const normalizeData = () => {
		const chains = [];
		data.getProtocols.forEach((protocol, p) => {
			chains[p] = {
				versions: [],
				name: protocol.name,
				logo: protocol.logo,
				description: protocol.description
			};
			protocol.versions.forEach((version, i) => {
				const uniqueChains = [];
				chains[p].versions[i] = {
					name: version.name,
					protocolName: version.protocolName,
					chains: []
				};

				version.contracts.forEach(contract => {
					if (!uniqueChains.includes(contract.chain.name)) {
						uniqueChains.push(contract.chain.name);
						chains[p].versions[i].chains.push(contract.chain);
					}
				});
			});
		});

		return chains;
	};

	return normalizeData() as NormalizedProtocols;
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

	const data = await client.request(query, {
		user: address,
		protocol,
		chainId,
		version
	});
	return data as { getLendingProtocolUserData: LendingProtocolUserData };
};
