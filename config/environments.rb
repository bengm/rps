#The environment variable DATABASE_URL should be in the following format:
# => postgres://{user}:{password}@{host}:{port}/path
configure :development do
  set :database, 'sqlite:///dev.db'
end