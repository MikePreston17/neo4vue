//https://memgraph.com/blog/cypher-cheat-sheet
// const uri = import.meta.env.VITE_VERCEL_URI
// const user = import.meta.env.VITE_VERCEL_USER
// const password = import.meta.env.VITE_VERCEL_PASSWORD
import neo4j from "neo4j-driver";

export const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

export const toObjectFormat = (records = []) => {
  return records?.map((r) => r["_fields"]?.map((r) => r?.properties)?.[0]);
};

//Execute Raw Queries here
async function executeCypherQuery(statement, params = {}) {
  try {
    let session = driver.session();
    const result = await session.run(statement, params);
    await session.close();
    return result;
  } catch (error) {
    throw error; // we are logging this error at the time of calling this method
  }
}

export async function create(label = null, props = {}) {
  if (!label) return ["Label cannot be null"];

  let keys = toNeoProps(props);

  let query = `MERGE (p:${label} ${keys}) RETURN p`;

  console.log("query", query);
  const result = await executeCypherQuery(query, {
    ...props,
  });

  const single = result.records[0];
  const node = single.get(0);

  return node;
}

function toNeoProps(props) {
  return JSON.stringify(
    Object.assign(
      ...Object.keys(props).map((key) => {
        return { [key]: `$${key || ""}` };
      })
    )
  ); //.replaceAll(`"`, "");
}

export async function getRecords(label = null, limit = 10) {
  if (!label) throw Error(`label cannot be null or empty`);
  let query = `MATCH (n:${label}) return n LIMIT ${limit}`;
  let results = await executeCypherQuery(query, {});
  console.log("results", results);
  return toObjectFormat(results?.records);
}

export async function searchNodes(label = null, props = {}) {
  if (!label) throw Error(`label cannot be null or empty`);
  const query = `match (n:${label}) return n`;
  let results = await executeCypherQuery(query, {});
  return toObjectFormat(results?.records);
}

export const deleteNode = async (label = null, id = null) => {
  if (!label) throw Error(`label cannot be null or empty`);
  const query = `
  match (n: ${label}{Id: '${id}'}) detach delete n
  `.trim();
  console.log("query", query);
  try {
    let results = await executeCypherQuery(query, {});
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
