from fastapi import FastAPI
from pydantic import BaseModel
import db
from sqlalchemy import text, insert
from uuid import uuid4

app = FastAPI()

class TestItem(BaseModel):
    name: str

class MemoItem(BaseModel):
    objectId: str | any
    text:str
    x:int
    y:int
    bgcolor:str
    workspace_id: int


items = []

@app.get("/")
async def test():
    with db.engine.connect() as connection:
        result = connection.execute(text("SELECT * FROM notes"))
        print(result.fetchall())
        return {"Hello" : result.fetchall()}
    

@app.post("/echo")
async def echo(item: TestItem):
    return {"got": item.name}



# Testing posts and gets with frontend
# list used for storage for now :D 
# routes are bad and will be made proper at a later date
@app.post("/objects/add/memo")
async def addMemo(MemoItem: MemoItem):
    try: {
        items.append(MemoItem)

    }
    except:
        return {"success": False}
    return {"success": True}

@app.get("/objects/get/memo/all")
async def getMemo():
    return {"items": items}


@app.post("/new/workspace")
async def newWorkspace(workspace: TestItem):
    """Add new workspace"""

    with db.engine.connect() as connection:
        res = connection.execute(text(f"INSERT INTO workspaces (name) VALUES ('{workspace.name}')"))
        connection.commit()
        return {"status": "yes"}

@app.post("/new/memo")
async def newMemo(memo: MemoItem):
    """Adds a new memo to the database"""

    # dummy id was provided with new memo so delete it and create an actual ID
    del memo.objectId
    memo.objectId = str(uuid4())

    stmt = f"""INSERT INTO notes (text, positionx, positiony, color, workspace_id)
            VALUES ({str(memo.__dict__.values()).split("[")[1][:-2]})""" # dont ask, it works
        
    print(stmt)

    with db.engine.connect() as connection:
        connection.execute(text(stmt))
        connection.commit()

    return {"objectId": memo.objectId}
