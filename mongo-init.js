db.createUser(
  {
    user: "user",
    pwd: "DY9687FH",
    roles: [
      {
        role: "readWrite",
        db: "maindb"
      }
    ]
  }
);