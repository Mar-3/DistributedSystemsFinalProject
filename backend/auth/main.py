from fastapi import FastAPI
from pydantic import BaseModel
from sqlalchemy import text
from uuid import uuid4
import db
app = FastAPI(root_paht="/api/auth")

class Request(BaseModel):
    workspace_name: str


@app.post("/")
async def auth(req: Request):
    """
    Connect to a workspace by its name.
    If a workspace doen't exist with given name, create new
    """
    with db.engine.connect() as conn:
        res = conn.execute(text(f"SELECT id FROM workspaces WHERE name='{req.workspace_name}';"))
        
        id = res.scalar()

        if not id:
            new_id = str(uuid4())
            conn.execute(text(f"INSERT INTO workspaces (id, name) VALUES ('{new_id}', '{req.workspace_name}')"))
            conn.commit()
            return {"id": new_id}
        else:
            return {"id": id}            

    




