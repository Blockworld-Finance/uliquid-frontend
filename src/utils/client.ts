import { GraphQLClient } from "graphql-request";

const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;

const client = new GraphQLClient(endpoint, { headers: {} });

export default client;
