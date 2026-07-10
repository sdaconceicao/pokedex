import { yoga } from "../src/yoga.js";

// Vercel serverless entry point. graphql-yoga's handler is directly
// compatible with Node's (req, res) signature. Requests arrive at
// /graphql via the rewrite in vercel.json, matching yoga's endpoint.
export default yoga;
