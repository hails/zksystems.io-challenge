# Code-Challenge-Senior-Backend

### Solution
The solution was thought as an RPC interface over a `Defect` service which would be responsable of some CRUD operations.

- `src/defect.ts` is our `Defect` service
- `src/repository` contains the functions which will interact with the database
- `src/middlewares/rpc.js` would be responsible for calling the `Defect` service methods


No tests were written because the challenge itself is quite contrived and a lot of assumptions were made already.
