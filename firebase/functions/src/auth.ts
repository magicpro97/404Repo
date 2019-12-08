import * as OAuth from "oauth";
import * as express from "express";
import * as cors from "cors";

export const auth = express();
const OAuth2 = OAuth.OAuth2;
const grant_type = "authorization_code";
const client_id = "c6946eae860a8ff7a701a56cfc7363d6";
const client_secret =
  "f19d7eb89c016f09b9a11d5d02dc15627cc83934a29f12bb5827837b3c912abb";
const url_authorize = "https://accounts.haravan.com/connect/authorize";
const url_connect_token = "https://accounts.haravan.com/connect/token";
const url_server = "https://us-central1-repo-404cf.cloudfunctions.net";
const hr_callback_url = `${url_server}/auth`;

auth.use(cors({ origin: true }));

auth.post("", async (req, res) => {
  console.log(req.body);
  const { code } = req.body;
  if (code) {
    const params = {
      grant_type: grant_type,
      redirect_uri: hr_callback_url
    };

    const _oauth2 = new OAuth2(
      client_id,
      client_secret,
      "",
      url_authorize,
      url_connect_token
    );

    _oauth2.getOAuthAccessToken(
      code,
      params,
      (err, accessToken, refreshToken, _params) => {
        if (err) {
          const parseErrData = JSON.parse(err.data);
          console.log("error", parseErrData);
          res.send(err);
        } else {
          console.log("accessToken", accessToken);
          res.send(_params);
        }
      }
    );
  } else {
    res.statusCode = 500;
  }
});