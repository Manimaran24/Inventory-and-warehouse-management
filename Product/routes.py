from flask import Flask, jsonify, request
from models import product
from flask_restx import Resource, Namespace, Api
from db import db
from sqlalchemy.exc import IntegrityError

Product_route = Namespace('product', path='/product')
post_model = Product_route.model('post model', {})
rest_api = Api(
    title='Product API',
    doc='/api_doc',
    
)
@Product_route.route('/product')
class ProductAPI(Resource):
    def get(self):
        """
        Get all product details
        """
        name = request.args.get('name')
        category = request.args.get('category')
        total_stock = request.args.get('total_stock', type=int)
        available_stock = request.args.get('available_stock', type=int)
        price = request.args.get('price', type=int)

        query = product.query

        if name:
            query = query.filter(product.name.ilike(f"%{name}%"))
        if category:
            query = query.filter(product.category.ilike(f"%{category}%"))
        if total_stock is not None:
            query = query.filter(product.total_stock == total_stock)
        if available_stock is not None:
            query = query.filter(product.available_stock == available_stock)
        
        products = query.all()

        
        result = [
            {
                "product_id": p.product_id,
                "name": p.name,
                "category": p.category,
                "total_stock": p.total_stock,
                "available_stock": p.available_stock,
               
            }
            for p in products
        ]

        return jsonify(result)  
    

    @Product_route.expect(post_model)
    def post(self):
        """
        Add a new product to the database
        
        """
        

        try:
            if not request.is_json:
                return {"error": "Request must be JSON with Content-Type: application/json"}, 415

            data = request.json
            required_fields = ["product_id", "name", "category", "total_stock", "available_stock"]

            for field in required_fields:
                if field not in data:
                    return {"error": f"Missing required field: {field}"}, 400

            new_product = product(
                product_id=data["product_id"],
                name=data["name"],
                category=data["category"],
                total_stock=data["total_stock"],
                available_stock=data["available_stock"]
            )

            db.session.add(new_product)
            db.session.commit()

            return {"message": "Record successfully added"}, 201  

        except IntegrityError:
            db.session.rollback()
            return {"error": "Product ID already exists"}, 400

        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
      

     
@Product_route.route('/product/<int:product_id>') 
class ProductAPI(Resource): 
    def delete(self, product_id):
        """
        Delete a Product record by ID
        """
        try:
           
            product_record = product.query.get(product_id)

            
            if not product_record :
                return {"error": f"product ID {product_id} not found"}, 404

            
           

            
            db.session.delete(product_record)
            db.session.commit()

            return {"message": f"Product ID {product_id} successfully deleted"}, 200

        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
        
    @Product_route.expect(post_model)
    def put(self, product_id):
        """
        Update a product record by ID
        """
        try:
            if not request.is_json:
                return {"error": "Request must be JSON with Content-Type: application/json"}, 415

            
            product_record = product.query.get(product_id)
            if not product_record:
                return {"error": f"Product ID {product_id} not found"}, 404

            data = request.json

           
            if "name" in data:
                product_record.name = data["name"]
            if "category" in data:
                product_record.category = data["category"]
            if "total_stock" in data:
                product_record.total_stock = data["total_stock"]
            if "available_stock" in data:
                product_record.available_stock = data["available_stock"]
           

            db.session.commit()

            return {"message": f"Product ID {product_id} successfully updated"}, 200

        except IntegrityError:
            db.session.rollback()
            return {"error": "Database integrity error (e.g., duplicate product ID)"}, 400

        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500










