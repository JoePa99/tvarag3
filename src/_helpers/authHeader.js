export default function authHeader(token) {
  // return authorization header with jwt token
  if (typeof token === "undefined" || typeof token === "string") {
    // let user = JSON.parse(sessionStorage.getItem("user"));
    token = token;
  }
  if (token) {
    return token;
  } else {
    return null;
  }
}
