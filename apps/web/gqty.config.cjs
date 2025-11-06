/**
 * @type {import("@gqty/cli").GQtyConfig}
 */
const config = {
  frameworks: [],
  scalarTypes: { DateTime: "string" },
  introspection: {
    endpoint: "SPECIFY_ENDPOINT_OR_SCHEMA_FILE_PATH_HERE",
    headers: {},
  },
  endpoint: "/api/graphql",
  destination: "./src/gqty/index.ts",
  subscriptions: false,
  javascriptOutput: false,
  enumStyle: "enum",
  enumsAsConst: false,
};

module.exports = config;
