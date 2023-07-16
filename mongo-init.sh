set -e

mongo <<EOF
db = db.getSiblingDB('database')

db.createUser({
  user: 'user',
  pwd: '$SALES_PASSWORD',
  roles: [{ role: 'readWrite', db: 'database' }],
});

db = db.getSiblingDB('warehouse')

db.createUser({
  user: 'warehouse',
  pwd: '$WAREHOUSE_PASSWORD',
  roles: [{ role: 'readWrite', db: 'warehouse' }],
});

EOF
