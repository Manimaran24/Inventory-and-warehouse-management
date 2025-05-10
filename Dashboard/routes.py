from flask import Flask, Blueprint, jsonify, request
from models import delivery,Warehouse,product,Inventory,intransit
from flask_restx import Resource, Namespace, Api
from db import db
from sqlalchemy import func
Dashboard_route = Namespace('Dashboard', path='/Dashboard')

rest_api = Api(
    title='Dashboard API',
    doc='/api_doc',
    url_scheme='http'
)
post_model= Dashboard_route.model('PostModel', {})
@Dashboard_route.route('/Dashboard')
class DashboardAPI(Resource):
    def get(self):  
        """
        Get only records for the dashboard
        """
        warehouses = Warehouse.query.all()
        products = product.query.all()
        delivery_count=db.session.query(delivery).count()
        intransit_count=db.session.query(intransit).count()
        inventory_count=db.session.query(Inventory).count()
        ans = [{
            "location": w.location,
            "capacity": w.capacity
            
        } for w in warehouses]
        
        product_ans=[{
            "name": p.name,
            "total_stock": p.total_stock,
            "availbale_stock":p.available_stock
        } for p in products]
        top_product=db.session.query(
            delivery.product_id,
            product.name,
            func.sum(delivery.quantity).label("quantity")
        ).join(
            product,delivery.product_id == product.product_id,isouter=True
        ).group_by(
            delivery.product_id,
            product.name
        ).all()
        data = [
    {
        # "product_id": r.product_id,
        "product_name": r.name,
        "total_quantity": r.quantity
    }
    for r in top_product
]


        return {"warehouses": ans,
                "product":product_ans,
                "top_product":data,
                "deivery_count":delivery_count,
                "intransit_count":intransit_count,
                "inventory_count":inventory_count
                }, 200
