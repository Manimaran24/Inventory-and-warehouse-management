from flask import Flask, Blueprint, jsonify, request
from models import delivery,Warehouse,product,Inventory,intransit
from flask_restx import Resource, Namespace, Api
from db import db
Delivery_route = Namespace('Delivery', path='/delivery')

rest_api = Api(
    title='Delivery API',
    doc='/api_doc',
    url_scheme='http'
)
post_model= Delivery_route.model('PostModel', {})
@Delivery_route.route('/Delivery')
class DeliveryAPI(Resource):
    def get(self):  
        """
        Get all Delivery details 
        """
        Delivery_id = request.args.get('Delivery_id', type=int)
        Product_id = request.args.get('Product_id', type=int)
        warehouse_id = request.args.get('Warehouse_id', type=int)
        Quantity = request.args.get('Quantity', type=int)
        shipped_date = request.args.get('shipped_date', type=int)
        query = delivery.query
        if Delivery_id:
            query = query.filter(delivery.Delivery_id == Delivery_id)
        if Product_id:
            query = query.filter(delivery.Product_id == Product_id)
        if warehouse_id:
            query = query.filter(delivery.warehouse_id == warehouse_id)
        if Quantity:
            query = query.filter(delivery.Quantity == Quantity)
        if shipped_date:
             query = query.filter(delivery.shipped_date == shipped_date)
            
        deliveries = query.all()
        result = [
            {
                'Delivery_id': d.delivery_id,
                'Product_id': d.product_id,
                'Warehouse_id': d.warehouse_id,
                'Quantity': d.quantity,
                'Shipped_date': d.shipped_date 
            } for d in deliveries
        ]
        return jsonify(result)
        
    @Delivery_route.expect(post_model)
    def post(self):
        """
        Add a new delivery to the database
        """
        try:
            if not request.is_json:
                return {"error": "Request must be JSON with Content-Type: application/json"}, 415

            data = request.json
            required_fields = ["Product_id", "warehouse_id", "Quantity"]

            for field in required_fields:
                if field not in data:
                    return {"error": f"Missing required field: {field}"}, 400
                
            warehouse_id=data["warehouse_id"]
            product_id=data["Product_id"]
            quantity=data["Quantity"]

            
            inventory_record = Inventory.query.filter_by(
                product_id=product_id, warehouse_id=warehouse_id
            ).first()

            if not inventory_record:
                return {"error": "Inventory not found for this product in the warehouse"}, 400

           
            if inventory_record.quantity < quantity:
                return {"error": "Not enough stock available"}, 400

          
            inventory_record.quantity -= quantity 

            intransit_record= intransit.query.filter_by(
                product_id=product_id
            ).first()
            if not intransit_record:
                return {"error":"Intransit not found"}
            if intransit_record.quantity<quantity:
                return {"error":"Not enough Stock"},400
            intransit_record.quantity-=quantity

            

            new_delivery = delivery(
                product_id=data["Product_id"],
                warehouse_id=data["warehouse_id"],
                quantity=data["Quantity"],
                shipped_date = data.get("shipped_date", None)  

            )

            db.session.add(new_delivery)
            db.session.commit()

            return {"message": "Record successfully added"}, 201  

        except Exception as e:
            db.session.rollback()
            print('from exception')
            return {"error": str(e)}, 500


@Delivery_route.route('/Delivery/<int:delivery_id>')
class DeliveryAPI(Resource):        
    def delete(self, delivery_id):
        """
        Delete a delivery record by ID
        """
        try:
            print(delivery_id, "id")  
            
         
            delivery_record = delivery.query.get(delivery_id)
            if not delivery_record:
                return {"error": f"Delivery ID {delivery_id} not found"}, 404

            db.session.delete(delivery_record)
            db.session.commit()

            return {"message": f"Delivery ID {delivery_id} successfully deleted"}, 200

        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500   

    @Delivery_route.expect(post_model)
    def put(self, delivery_id):
        """
        Update a delivery record by ID
        """
        try:
            if not request.is_json:
                return {"error": "Request must be JSON with Content-Type: application/json"}, 415

           
            delivery_record = delivery.query.get(delivery_id)
            if not delivery_record:
                return {"error": f"Delivery ID {delivery_id} not found"}, 404

            data = request.json

          
            if "Product_id" in data:
                delivery_record.Product_id = data["Product_id"]
            if "warehouse_id" in data:
                delivery_record.warehouse_id = data["warehouse_id"]
            if "Quantity" in data:
                delivery_record.Quantity = data["Quantity"]
            if "shipped_date" in data:
                delivery_record.shipped_date = data["shipped_date"]
           
            db.session.commit()

            return {"message": f"Delivery ID {delivery_id} successfully updated"}, 200

        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500 
         
      
@Delivery_route.route('/Delivery_details/<int:Delivery_id>')
class DeliveryAPI(Resource):
    def get(self,Delivery_id):
        """
        Get Delivery details including 
        """
        try:
           
            Delivery_details = db.session.query(
                delivery.Delivery_id,
                Warehouse.warehouse_id,
                Warehouse.location,
                product.product_id,
                product.name,
                delivery.Quantity,
                delivery.shipped_date
            ).join(
                Warehouse,
                delivery.warehouse_id == Warehouse.warehouse_id
            ).join(
                product,
                delivery.Product_id == product.product_id
            ).filter(
                delivery.Delivery_id == Delivery_id
            ).first()
            if not Delivery_details:
                return jsonify({"error": "No inventory details found"}), 404
            print(Delivery_details)
            result = {
                "warehouse_id": Delivery_details.warehouse_id,
                "warehouse_location": Delivery_details.location,
                "product_id": Delivery_details.product_id,
                "product_name": Delivery_details.name,
                "quantity": Delivery_details.Quantity,
                "shipped_date":str(Delivery_details.shipped_date)
            }
           
            print(result)
            return {"result":result}, 200

        except Exception as e:
            
            return {"error": str(e)}, 500
   










 
  