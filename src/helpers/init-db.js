import faunadb from "faunadb";
// const chalk = require("chalk");
// let key = checkForFaunaKey();
let key = "fnADwAb8WMACBdmk7a-pZlu3uheEn7p5hfQZn93h";

export const q = faunadb.query;
export let client = new faunadb.Client({
  secret: key
});
/*
function checkForFaunaKey() {
  if (!process.env.FAUNADB_SERVER_SECRET) {
    console.log(
      chalk.bold.red(
        "Required 'FAUNADB_SERVER_SECRET' environment variable not found."
      )
    );
    console.log(
      chalk.yellow.bold(`
    ~~~~~~~~~~~~~~~~~~~~~~~~~
    You can create your fauna db server secret by entering:

    export FAUNADB_SERVER_SECRET=xxx

    Then ensure you have added the server secret into your Netlify site as an environment variable 
    with the key 'FAUNADB_SERVER_SECRET'.
    ~~~~~~~~~~~~~~~~~~~~~~~~~~
      `)
    );
    process.exit(1);
  }

  console.log(
    chalk.green(
      `Found FAUNADB_SERVER_SECRET environment variable in Netlify site`
    )
  );
  return process.env.FAUNADB_SERVER_SECRET;
}
*/