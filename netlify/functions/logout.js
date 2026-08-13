const { json } = require("./_backend");

exports.handler = async () => {
  return json(200, { ok: true }, {
    "set-cookie": "kool_mate_cms=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0"
  });
};
