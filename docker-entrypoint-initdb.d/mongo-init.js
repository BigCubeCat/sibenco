const db_name = "database";
const user_name = "user";
const password = "p0ssword";

db = db.getSiblingDB(db_name);
db.createUser({
  user: user_name,
  pwd: password,
  roles: [{ role: "readWrite", db: db_name }],
});

