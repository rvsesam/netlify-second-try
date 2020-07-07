/* idempotent operation to bootstrap database */
const faunadb = require("faunadb");
const chalk = require("chalk");

const q = faunadb.query;

/*  */
function setupFaunaDB() {
  console.log(chalk.yellow("Attempting to create the DB schemas..."));

  let key = checkForFaunaKey();

  const client = new faunadb.Client({
    secret: key
  });

  /* Based on your requirements, change the schema here */
  return client
    .query(
      q.CreateCollection({
        name: "users"
      })
    )
    .then(() =>
      client.query(
        q.Do(
          q.CreateCollection({
            name: "lists"
          }),
          q.CreateCollection({
            name: "todos",
            permissions: {
              create: q.Collection("users")
            }
          })
        )
      )
    )
    .then(() =>
      client.query(
        q.Do(
          q.CreateIndex({
            name: "allUsers",
            source: q.Collection("users")
          }),
          q.CreateIndex({
            name: "allTodos",
            source: q.Collection("todos")
          }),
          q.CreateIndex({
            name: "allLists",
            source: q.Collection("lists")
          }),
          q.CreateIndex({
            name: "userByLast",
            source: q.Collection("users"),
            terms: [
              {
                field: ["data", "last"]
              }
            ],
            unique: true
          }),
          q.CreateIndex({
            name: "todosTitleCompleted",
            source: q.Collection("todos"),
            values: [
              { field: ["data", "title"] },
              { field: ["ref"] }
            ],
            terms: [
              {
                field: ["data", "completed"]
              }
            ],
          })
        )
      )
    )
    .catch(e => {
      if (e.message === "instance already exists") {
        console.log("Schemas are already created... skipping");
        process.exit(0);
      } else {
        console.error("There was a problem bootstrapping the db", e);
        throw e;
      }
    });
}

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

setupFaunaDB()
  .then(() => {
    console.log(chalk.green(`Bootstraping DB schemas was successful!`));
  })
  .catch(err => {
    console.log(
      chalk.red.bold(
        `There was an issue bootstrapping the DB schemas due to: ${err}`
      )
    );
    process.exit(1);
  });
  