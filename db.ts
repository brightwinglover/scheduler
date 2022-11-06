const BASE_URI =
  `https://data.mongodb-api.com/app/data-pioyh/endpoint/data/v1/action`;
const DATA_SOURCE = "Clussy";
const DATABASE = "Clussy";
const COLLECTION = "Birthdays";
const DATA_API_KEY = Deno.env.get("MONGODB_API_KEY");
if (!DATA_API_KEY) {
  console.error("No MongoDB key found.");
  Deno.exit(1);
}

const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "api-key": DATA_API_KEY,
  },
  body: "",
};

const query = {
  collection: COLLECTION,
  database: DATABASE,
  dataSource: DATA_SOURCE,
  //   projection: { "key": "value" },
};

interface Birthday {
  readonly _id: string;
  readonly Holder: string;
  readonly Recipient: string;
  readonly Date: Date;
}

export async function getBirthdays(): Promise<Birthday[]> {
  options.body = JSON.stringify(query);
  const res = await fetch(BASE_URI + "/find", options);
  const data = await res.json();
  return <Birthday[]> data.documents;
}
