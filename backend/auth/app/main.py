from fastapi import FastAPI
from pydantic import BaseModel
from sqlalchemy import text
from uuid import uuid4
from starlette.middleware.cors import CORSMiddleware
import db
app = FastAPI(root_path="/api/auth")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "http://74.234.25.173", "http://74.234.25.173:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

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

    




