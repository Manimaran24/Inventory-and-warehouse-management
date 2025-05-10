from flask import Flask, jsonify, request
from models import intransit
from flask_restx import Resource, Namespace, Api, reqparse
from db import db


InTransit_route = Namespace('Transit', path='/intransit')


rest_api = Api(
    title='InTransit API',
    doc='/api_doc',
    url_scheme='http'
)
post_model = InTransit_route.model('post model', {})
rest_api.add_namespace(InTransit_route)
parser = reqparse.RequestParser()

@InTransit_route.route('/InTransit')
class InTransitAPI(Resource):

    @InTransit_route.expect(post_model)
    def post(self):
        """
         Add new InTransit 
       
        """
        try:
            data = request.json
            print("required data",data)
            if not data:
                return {"error": "Request must be JSON"}, 415

            required_fields = ["product_id", "source_warehouse_id", "destination_warehouse_id", "quantity", "shipped_date", "inward_outward"]

            if not all(field in data for field in required_fields):
                return {"error": "Missing required fields"}, 400

            if data["inward_outward"] not in ["Inward", "Outward"]:
                return {"error": "Invalid value for inwardoutward. Must be 'Inward' or 'Outward'"}, 400
 

            if "inward_outward" not in data or data["inward_outward"] not in ["Inward", "Outward"]:
                return {"message": "Invalid value. Must be 'Inward' or 'Outward'"}, 400
            
            
            new_Data = intransit(
                 product_id=data["product_id"],
                 quantity=data["quantity"],
                 source_warehouse_id=data["source_warehouse_id"],
                 destination_warehouse_id=data["destination_warehouse_id"],
                 shipped_date=data["shipped_date"],
                 inward_outward=data["inward_outward"]
)

            print("Object Created Successfully")
            print("New Data Object:", new_Data.__dict__)
            db.session.add(new_Data)
            
            db.session.commit()
            return {"message": "Record successfully added"}, 201

        except Exception as e:
            return {"error": str(e)}, 500
    

    

    def get(self):  
        """
        Get all intransit details 
        """
        product_id = request.args.get('product_id',type=int) 
        source_warehouse_id = request.args.get('source_warehouse_id', type=int) 
        destination_warehouse_id=request.args.get('destination_warehouse_id',type=int)
        quantity=request.args.get('quantity',type=int)
        shipped_date=request.args.get('shipped_date',type=int)
        inward_outward=request.args.get('inward_outward',type=int)

        query = intransit.query 
        if product_id:
            query = query.filter(intransit.product_id == product_id)
        if source_warehouse_id:
            query = query.filter(intransit.source_warehouse_id == source_warehouse_id)
        if destination_warehouse_id:
            query = query.filter(intransit.destination_warehouse_id == destination_warehouse_id)
        if quantity:
            query = query.filter(intransit.quantity == quantity)
        if shipped_date:
            query = query.filter(intransit.shipped_date == shipped_date)
        if inward_outward:
            query = query.filter(intransit.inward_outward == inward_outward)

        
        intransit_records = query.all()

     
        result = [
            {
                "intransit_id": record.intransit_id,
                "product_id": record.product_id,
                "source_warehouse_id": record.source_warehouse_id,
                "destination_warehouse_id": record.destination_warehouse_id,
                "quantity": record.quantity,
                "shipped_date": record.shipped_date.strftime('%Y-%m-%d'),  
                "inward_outward": record.inward_outward
            }
            for record in intransit_records
        ]

        return jsonify(result)
    
@InTransit_route.route('/intransit/<int:intransit_id>')
class InTransitAPI(Resource):  
    def delete(self,intransit_id):
        """
        Delete an intransit record by ID
        """
        try:
            intransit_id = request.args.get('intransit_id', None)

            if not intransit_id:
                return {"error": "Missing intransit_id parameter"}, 400

            intransit_id = int(intransit_id)

            intransit_record = intransit.query.get(intransit_id)

            if not intransit_record:
                return {"error": f"intransit ID {intransit_id} not found"}, 404

            db.session.delete(intransit_record)
            db.session.commit()

            return {"message": f"intransit ID {intransit_id} successfully deleted"}, 200

        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500

    @InTransit_route.expect(post_model)
    def put(self, intransit_id):
        """
        Update an intransit record by ID
        """
        try:
            if not request.is_json:
                return {"error": "Request must be JSON with Content-Type: application/json"}, 415

           
            intransit_record = intransit.query.get(intransit_id)
            if not intransit_record:
                return {"error": f"Intransit ID {intransit_id} not found"}, 404

            data = request.json

            
            if "product_id" in data:
                intransit_record.product_id = data["product_id"]
            if "source_warehouse_id" in data:
                intransit_record.source_warehouse_id = data["source_warehouse_id"]
            if "destination_warehouse_id" in data:
                intransit_record.destination_warehouse_id = data["destination_warehouse_id"]
            if "quantity" in data:
                intransit_record.quantity = data["quantity"]
            if "shipped_date" in data:
                intransit_record.shipped_date = data["shipped_date"]
            if "inward_outward" in data:
                if data["inward_outward"] not in ["Inward", "Outward"]:
                    return {"error": "Invalid value for inward_outward. Must be 'Inward' or 'Outward'"}, 400
                intransit_record.inward_outward = data["inward_outward"]

            db.session.commit()
            return {"message": f"Intransit ID {intransit_id} successfully updated"}, 200

        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500    

    
    














    


  

    
         


 
       
       
        



