FROM python:3.11-slim

WORKDIR /src

COPY ./requirements.txt /src/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /src/requirements.txt

ENV PYTHONPATH /src/app/

COPY ./app/ /src/app

CMD ["gunicorn" ,"app.main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]