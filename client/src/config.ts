// TKDODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'vd4pox4u02'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/dev`

export const authConfig = {
  // TKDODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-pw1zjuyq.eu.auth0.com',            // Auth0 domain
  clientId: 'a06pvalvTVC6RCDNG4O5y7D2bU7T1WT1',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
