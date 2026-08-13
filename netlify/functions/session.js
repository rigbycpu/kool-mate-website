const { isAuthed, json } = require("./_backend");

exports.handler = async (event) => {
  return json(200, { ok: true, authenticated: isAuthed(event) });
};
