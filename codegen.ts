import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	overwrite: true,
	schema: "https://api.uliquid.finance/",
	documents: "./src/schema.graphql",
	generates: {
		"./types.d.ts": {
			preset: "client",
			plugins: [],
		},
		"./graphql.schema.json": {
			plugins: ["introspection"],
		},
	},
};

export default config;
