-- Create users schema
CREATE SCHEMA IF NOT EXISTS users;

-- Grant permissions to the pokedex_user
GRANT ALL PRIVILEGES ON SCHEMA users TO pokedex_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA users TO pokedex_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA users TO pokedex_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA users GRANT ALL PRIVILEGES ON TABLES TO pokedex_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA users GRANT ALL PRIVILEGES ON SEQUENCES TO pokedex_user; 