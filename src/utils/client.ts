import { GraphQLClient } from "graphql-request";

const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;

const client = (signal?: AbortSignal) =>
	new GraphQLClient(endpoint, { headers: {}, ...(signal && { signal }) });

export default client;
