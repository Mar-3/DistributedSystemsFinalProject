from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class TestItem(BaseModel):
    name: str

class MemoItem(BaseModel):
    objectId: int
    object:str
    x:int
    y:int
    text:str
    bgcolor:str

items = []

@app.get("/")
async def test():
    return {"Hello" : "World"}
    

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
