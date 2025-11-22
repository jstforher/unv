#!/bin/bash

# wait-for-db.sh - Wait for PostgreSQL database to be available

set -e

host="$1"
shift
cmd="$@"

# Default to localhost if no host provided
if [ -z "$host" ]; then
    host="localhost"
fi

# Wait for PostgreSQL to be ready
until PGPASSWORD="$DB_PASSWORD" psql -h "$host" -U "$DB_USER" -d "$DB_NAME" -c '\q'; do
  >&2 echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

>&2 echo "PostgreSQL is up - executing command"

# Execute the command passed to the script
exec $cmd