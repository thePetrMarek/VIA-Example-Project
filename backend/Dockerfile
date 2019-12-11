FROM python:3

ADD main.py /

RUN pip install flask
RUN pip install flask_restplus
RUN pip install flask_cors

CMD [ "python", "./main.py" ]