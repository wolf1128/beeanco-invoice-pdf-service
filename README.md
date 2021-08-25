# objective

Main objective is to develop a node.js microservice that renders invoices to PDFs. It should expose a REST API that handles incoming JSON requests and renders the invoice.

## Details

- First install the dependencies using `npm install`
- The service should be started with `npm run start` and listen on port 3000

## Testing

Send the sample request data at [`./test/fixtures/sample-request.json`](./test/fixtures/sample-request.json) to your service in a post request and check the result.

Running `npm run test` does exactly this, with _curl_:

```sh
curl -X POST -H "Content-Type: application/json" -d @./test/fixtures/sample-request.json http://localhost:3000/api/invoices --output test/results/sample-request.pdf
```

> Note that the test script may not work on a non-unix (e.g. Windows) platform