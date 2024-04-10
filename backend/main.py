from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class TestItem(BaseModel):
    name: str

@app.get("/")
async def test():
    return {"Hello" : "World"}
    

@app.post("/echo")
async def echo(item: TestItem):
    return {"got": item.name}
