from fastapi import FastAPI, WebSocket

from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import db
from sqlalchemy import text, insert
from uuid import uuid4

app = FastAPI()

class WorkspaceItem(BaseModel):
    name: str

class MemoItem(BaseModel):
    id: str
    text:str
    positionx:int
    positiony:int
    bgcolor:str
    workspace_id: str

items = []

@app.get("/")
async def test():
    with db.engine.connect() as connection:
        result = connection.execute(text("SELECT * FROM notes"))
        print(result.fetchall())
        return {"Hello" : result.fetchall()}
    


# Websocket connection to clients

# TODO handling for multiple clients and sending data according to their workspace id.

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_json()
        print(f"Sent from client: ", data)
        match (data["operation"]):
            case "selectWorkspace":
                ret = await selectWorkSpace(data["item"])
            case "addItem":
                ret = await addMemo(data["item"])
            case "edit":
                ret = await editMemo(data["item"])
            case "delete":
                ret = await deleteMemo(data["id"])
            case _:
                ret = {"msg": "unknown operation"}
        print(f"Returning {ret}")
        await websocket.send_json(ret)



async def selectWorkSpace(workspace: WorkspaceItem):
    """Create or get workspace id to client"""


    with db.engine.connect() as connection:
        workspaceId = connection.execute(text(f"""SELECT id FROM workspaces WHERE name='{workspace['name']}'""")).fetchone()
        objs = []
        if (workspaceId == None):
            workspaceId = str(uuid4())
            connection.execute(text(f"INSERT INTO workspaces (id, name) VALUES ( '{workspaceId}','{workspace['name']}')"))
            connection.commit()

            

            # TODO return all current items in workspace
        else:
            workspaceId = str(workspaceId).split("'")[1]
            rows = connection.execute(text(f"""SELECT * FROM notes WHERE workspace_id='{workspaceId}'"""))
            for row in rows:
                objs.append({"id":str(row[0]), "text":str(row[1]), "positionx":int(row[2]), "positiony":int(row[3]), "color":str(row[4]), "workspace_id":str(row[5])})
            for row in objs:
                print(row)
        
        return {"operation":"selectWorkspace", "workspaceID": str(workspaceId), "items":objs}
    

async def editMemo(memo:MemoItem):
    """Edits a memo in the database"""
    
    stmt = f"""UPDATE notes SET text = '{memo['text']}', positionx={memo['positionx']}, positiony={memo['positiony']}, color='{memo['color']}' 
    WHERE id='{memo["id"]}'"""

    with db.engine.connect() as connection:
        connection.execute(text(stmt))
        connection.commit()
    return {"success": True}
    

async def addMemo(memo: MemoItem):
    """Adds a new memo to the database"""

    # dummy id was provided with new memo so delete it and create an actual ID
    memo['id'] = str(uuid4())

    # get workspace id via workspace name

    stmt = f"""INSERT INTO notes (text, positionx, positiony, color, workspace_id, id)
            VALUES ({str(memo.values()).split("[")[1][:-2]})""" # dont ask, it works
        
    print(stmt)

    with db.engine.connect() as connection:
        connection.execute(text(stmt))
        connection.commit()

    return {"operation": "addObject", "item": memo}

async def deleteMemo(id: str):
    """Removes a memo from the database"""

    stmt = f"DELETE FROM notes WHERE id='{id}'"

    with db.engine.connect() as connection:
        connection.execute(text(stmt))
        connection.commit()

    return {"success": True}