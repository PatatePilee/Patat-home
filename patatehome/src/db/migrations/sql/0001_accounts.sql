CREATE TABLE IF NOT EXISTS accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hdv INTEGER NOT NULL,
  level INTEGER NOT NULL,
  price INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  features TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
); 