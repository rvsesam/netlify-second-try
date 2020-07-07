import faunadb from "faunadb";
import { faunakey } from "./config";
export const q = faunadb.query;
export let client = new faunadb.Client({
  secret: faunakey
});
