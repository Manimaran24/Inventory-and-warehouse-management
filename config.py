from flask import Flask
from flask_cors import CORS
# from flask_sqlalchemy import SQLAlchemy
from flasgger import Swagger 
from db import db
# from Warehouse.routes import warehouse_db
from sqlalchemy import text
from models import delivery
# from Inventory.routes import inventory_db
from Inventory.routes import rest_api,inventory_route
from InTransit.routes import rest_api,InTransit_route
from Warehouse.routes import rest_api,warehouse_route
from Product.routes import rest_api,Product_route
from Delivery.routes import rest_api,Delivery_route
from Dashboard.routes import rest_api,Dashboard_route
app=Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI']="postgresql://postgres:123456@localhost:5432/postgres"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False


try:
    with app.app_context():
        db.init_app(app)
        db.create_all()
        rest_api.init_app(app)
        rest_api.add_namespace(inventory_route)
        rest_api.add_namespace(InTransit_route)
        rest_api.add_namespace(warehouse_route)
        rest_api.add_namespace(Product_route) 
        rest_api.add_namespace(Delivery_route)
        rest_api.add_namespace(Dashboard_route)
        
        print("PostgreSQL Database Connected Successfully!")
except Exception as e:
    print("Database Connection Failed:", e)


if __name__=='__main__':
    app.run(port=3000,debug=True)