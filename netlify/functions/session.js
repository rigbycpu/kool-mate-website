const { isAuthed, json } = require("./_github");

exports.handler = async (event) => {
  return json(200, { ok: true, authenticated: isAuthed(event) });
};
