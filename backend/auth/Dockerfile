FROM python:3.11-slim

WORKDIR /src

COPY ./requirements.txt /src/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /src/requirements.txt

COPY . /src/app

CMD ["uvicorn" ,"app.main:app", "--host", "0.0.0.0", "--port", "8001"]