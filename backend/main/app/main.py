from fastapi import FastAPI, WebSocket

from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import db
from sqlalchemy import text, insert
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# https://fastapi.tiangolo.com/advanced/websockets/

class WSConnection:
    def __init__(self, websocket:WebSocket):
        self.websocket = websocket
        self.workspaceId = None
    
    def setWorkspace(self, id:str):
        self.workspaceId = id



class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WSConnection] = []

    async def connect(self, client:WSConnection):
        print("New client")
        await client.websocket.accept()
        self.active_connections.append(client)

    def disconnect(self, client:WSConnection):
        self.active_connections.remove(client)

    async def sendToClient(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def sendToWorkspace(self, message, workspaceId):
        for client in self.active_connections:
            if client.workspaceId == workspaceId:
                await client.websocket.send_json(message)


manager = ConnectionManager()

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
        return {"Hello" : result.fetchall()}
    


# Websocket connection to clients

# TODO handling for multiple clients and sending data according to their workspace id.

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    client = WSConnection(websocket)
    await manager.connect(client)
    try:
        while True:
            data = await websocket.receive_json()
            print(data)
            match (data["operation"]):
                case "selectWorkspace":
                    client.setWorkspace(data["id"])
                    ret = await selectWorkSpace(client)
                case "addItem":
                    ret = await addMemo(data["item"])
                case "edit":
                    ret = await editMemo(data["item"])
                case "delete":
                    ret = await deleteMemo(data["id"])
                case _:
                    ret = {"msg": "unknown operation"}
            print("sending back:", ret)
            if data.get("workspaceId"):  # I dont know, checking if client is in workspace :D 
                await manager.sendToWorkspace(ret, str(data['workspaceId']))
            else:
                await websocket.send_json(ret)
    except Exception as e:
        print(e)
        manager.disconnect(client)
        print(f"Client disconnected.")



async def selectWorkSpace(client:WSConnection):
    """Create or get workspace id to client"""


    with db.engine.connect() as connection:
            
        objs = []
        workspaceId = client.workspaceId
        rows = connection.execute(text(f"""SELECT * FROM notes WHERE workspace_id='{workspaceId}'"""))
        for row in rows:
            objs.append({"id":str(row[0]), "text":str(row[1]), "positionx":int(row[2]), "positiony":int(row[3]), "color":str(row[4]), "workspace_id":str(row[5])})
        client.setWorkspace(workspaceId)
        return {"operation":"selectWorkspace", "workspaceID": str(workspaceId), "items":objs}
    

async def editMemo(memo:MemoItem):
    """Edits a memo in the database"""
    
    stmt = f"""UPDATE notes SET text = '{memo['text']}', positionx={memo['positionx']}, positiony={memo['positiony']}, color='{memo['color']}' 
    WHERE id='{memo["id"]}'"""

    with db.engine.connect() as connection:
        connection.execute(text(stmt))
        connection.commit()
    return {"operation": "editObject", "item":memo}
    

async def addMemo(memo: MemoItem):
    """Adds a new memo to the database"""

    # dummy id was provided with new memo so delete it and create an actual ID
    memo['id'] = str(uuid4())

    # get workspace id via workspace name

    stmt = f"""INSERT INTO notes (text, positionx, positiony, color, workspace_id, id)
            VALUES ({str(memo.values()).split("[")[1][:-2]})""" # dont ask, it works
        

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

    return {"operation": "removeObject", "id": id}