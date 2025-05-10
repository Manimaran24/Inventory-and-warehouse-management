# from flask import Flask, Blueprint, jsonify, request
# from models import Warehouse
# warehouse_db = Blueprint('warehouse', __name__)
from flask import Flask, Blueprint, jsonify, request
from models import Warehouse,Inventory
from flask_restx import Resource, Namespace, Api
from db import db


warehouse_route = Namespace('Warehouse', path='/')

rest_api = Api(
    title='Warehouse API',
    doc='/api_doc',
    url_scheme='http'
)
post_model= warehouse_route.model('post model', {})
@warehouse_route.route('/warehouse')

class WarehouseAPI(Resource):
    def get(self):  
        """
        Get all warehouse details 
        """
        location = request.args.get('location') 
        capacity = request.args.get('capacity', type=int)  

        query = Warehouse.query  
        if location:
            query = query.filter(Warehouse.location.ilike(f"%{location}%"))
        if capacity:
            query = query.filter(Warehouse.capacity == capacity)

        warehouses = query.all()
        ans = [{
            "warehouse_id": w.warehouse_id,
            "location": w.location,
            "capacity": w.capacity
        } for w in warehouses]

        print(ans)

        return {"results": ans}, 200
    

    
    @warehouse_route.expect(post_model)
    def post(self):
        """
        Add a new product to the database
       
        """
        

        try:
            if not request.is_json:
                return {"error": "Request must be JSON with Content-Type: application/json"}, 415

            data = request.json
            required_fields = ["warehouse_id","location","capacity"]

            for field in required_fields:
                if field not in data:
                    return {"error": f"Missing required field: {field}"}, 400

            new_warehouse = Warehouse(
              warehouse_id=data["warehouse_id"],
              location=data["location"],
              capacity=data["capacity"]
            )

            db.session.add(new_warehouse)
            db.session.commit()

            return {"message": "Record successfully added"}, 201  

        
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500 
        

       
    
@warehouse_route.route('/warehouse/<int:warehouse_id>')
class WarehouseAPI(Resource):
    def delete(self, warehouse_id):
        """
        Delete a warehouse record by ID
        """
        try:
            print(warehouse_id, "id")  
            
            
            warehouse_record = Warehouse.query.get(warehouse_id)
            if not warehouse_record:
                return {"error": f"Warehouse ID {warehouse_id} not found"}, 404

           
            db.session.delete(warehouse_record)
            db.session.commit()

            return {"message": f"Warehouse ID {warehouse_id} successfully deleted"}, 200

        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
        
    @warehouse_route.expect(post_model)
    def put(self, warehouse_id):
        """
        Update a warehouse record by ID
        """
        try:
            if not request.is_json:
                return {"error": "Request must be JSON with Content-Type: application/json"}, 415

            
            warehouse_record = Warehouse.query.get(warehouse_id)
            if not warehouse_record:
                return {"error": f"Warehouse ID {warehouse_id} not found"}, 404

            data = request.json

            
            if "location" in data:
                warehouse_record.location = data["location"]
            if "capacity" in data:
                warehouse_record.capacity = data["capacity"]
           

            db.session.commit()

            return {"message": f"Warehouse ID {warehouse_id} successfully updated"}, 200

        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500    
 