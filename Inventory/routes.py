from flask import Flask,  jsonify, request
from models import Warehouse, product,Inventory
from flask_restx import Resource, Namespace, Api
from db import db
inventory_route = Namespace('Inventory', path='/')

rest_api = Api(
    title='Inventory API',
    doc='/api_doc',
    url_scheme='http'
)
post_model= inventory_route.model('post model', {})

@inventory_route.route('/inventory/')
class InventoryAPI(Resource):
    def get(self):
        warehouse_id = request.args.get('warehouse_id', None)
        product_id = request.args.get('product_id', None)
        quantity = request.args.get('quantity', None)

        query = Inventory.query  

        if warehouse_id:
            query = query.filter(Inventory.warehouse_id == warehouse_id)
        if product_id:
            query = query.filter(Inventory.product_id == product_id)
        if quantity:
            query = query.filter(Inventory.quantity == quantity)

        inventories = query.all()

        if not inventories:
            return jsonify({"message": "No inventory found"}), 404
        
        ans = [{
            "inventory_id": i.inventory_id,  
            "warehouse_id": i.warehouse_id,
            "product_id": i.product_id,
            "quantity": i.quantity  
        } for i in inventories]

        print(ans)

        return {"results":ans}, 200
    


    
    @inventory_route.expect(post_model)
    def post(self):
        """
        Add a new product to the database
       
        """
        

        try:
            if not request.is_json:
                return {"error": "Request must be JSON with Content-Type: application/json"}, 415

            data = request.get_json()
            required_fields = ["inventory_id","warehouse_id","product_id","quantity"]

            for field in required_fields:
                if field not in data:
                    return {"error": f"Missing required field: {field}"}, 400

            new_inventory = Inventory(
              inventory_id=data["inventory_id"],
              warehouse_id=data["warehouse_id"],
              product_id=data["product_id"],
              quantity=data["quantity"]
            )

            db.session.add(new_inventory)
            db.session.commit()

            return {"message": "Record successfully added"}, 201  

        
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500


@inventory_route.route('/inventory/<int:inventory_id>')
class InventoryAPI(Resource):
    def delete(self, inventory_id):
        """
        Delete an inventory record by ID
        """
        try:
            print(inventory_id, "id")  

        
            inventory_record = Inventory.query.get(inventory_id)

            if not inventory_record:
                return {"error": f"Inventory ID {inventory_id} not found"}, 404

           
            db.session.delete(inventory_record)
            db.session.commit()

            return {"message": f"Inventory ID {inventory_id} successfully deleted"}, 200

        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
        
    @inventory_route.expect(post_model)
    def put(self, inventory_id):
        """
        Update an inventory record by ID
        """
        try:
            if not request.is_json:
                return {"error": "Request must be JSON with Content-Type: application/json"}, 415

           
            inventory_record = Inventory.query.get(inventory_id)
            if not inventory_record:
                return {"error": f"Inventory ID {inventory_id} not found"}, 404

            data = request.get_json()

            
            if "warehouse_id" in data:
                inventory_record.warehouse_id = data["warehouse_id"]
            if "product_id" in data:
                inventory_record.product_id = data["product_id"]
            if "quantity" in data:
                inventory_record.quantity = data["quantity"]
           

            db.session.commit()

            return {"message": f"Inventory ID {inventory_id} successfully updated"}, 200

        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500 
        
        
@inventory_route.route('/inventory_details/<int:inventory_id>')
class InventoryDetailsAPI(Resource):
    def get(self, inventory_id):
        """
        Get inventory details including warehouse name
        """
        try:
            print("UIO")
            inventory_details = db.session.query(
                Warehouse.warehouse_id,
                Warehouse.location,
                product.product_id,
                product.name,
                Inventory.product_id,
                Inventory.quantity
            ).join(
                Warehouse,
                Inventory.warehouse_id == Warehouse.warehouse_id
            ).join(
                product,
                Inventory.product_id == product.product_id
            ).filter(
                Inventory.inventory_id == inventory_id
            ).first()

            if not inventory_details:
                return jsonify({"error": "No inventory details found"}), 404
            print(inventory_details)
            result = {
                "warehouse_id": inventory_details.warehouse_id,
                "warehouse_location": inventory_details.location,
                "product_id": inventory_details.product_id,
                "product_name": inventory_details.name,
                "quantity": inventory_details.quantity
            }
            print("QWERT",result)
            return {"result":result}, 200

        except Exception as e:
            print("RTY")
            return {"error": str(e)}, 500

