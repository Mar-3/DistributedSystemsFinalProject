from sqlalchemy import create_engine, text

# TODO - Update the username and password and use env file
USERNAME = 'postgres'
PASSWORD = 'postgres'

HOSTNAME = 'localhost'
PORT = '6969'
DB_NAME = 'postgres'

conn_string = f'postgresql+psycopg2://{USERNAME}:{PASSWORD}@{HOSTNAME}:{PORT}/{DB_NAME}'

engine = create_engine(conn_string)

# test connection
with engine.connect() as connection:
    result = connection.execute(text("SELECT 1"))
    print(result.all())
    print("Connection successful")