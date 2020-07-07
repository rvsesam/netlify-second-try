/* idempotent operation to bootstrap database */
const faunadb = require("faunadb");
const chalk = require("chalk");

const q = faunadb.query;

/*  */
function setupFaunaDB() {
  console.log(chalk.yellow("Attempting to create records..."));

  let key = checkForFaunaKey();

  const client = new faunadb.Client({
    secret: key
  });
  
  return client
    .query(
      q.Do(
        q.Create(
          q.Collection('users'),
          { data: { first: 'Victor', last: "Hugo" } },
        ),
        q.Create(
          q.Collection('lists'),
          { data: { title: 'Principal' } },
        ),
        q.Create(
          q.Collection('lists'),
          { data: { title: 'Divers' } },
        ),
        q.Map(
          [
            'My cat and other marvels',
            'Pondering during a commute',
            'Deep meanings in a latte',
          ],
          q.Lambda(
            'title',
            q.Create(
              q.Collection('todos'),
              { data: { title: q.Var('title'), completed: false } },
            )
          ),
        )
      )
    )
    .catch(e => {
        console.error("There was a problem creating records in db", e);
        throw e;
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
    console.log(chalk.green(`Creating records in DB was successful!`));
  })
  .catch(err => {
    console.log(
      chalk.red.bold(
        `There was an issue creating records in the DB due to: ${err}`
      )
    );
    process.exit(1);
  });
  