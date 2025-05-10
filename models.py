from db import db

class Warehouse(db.Model):
    __tablename__='warehouse'
    warehouse_id=db.Column(db.Integer,primary_key=True)
    location=db.Column(db.String(100),nullable=False)
    capacity=db.Column(db.Integer,nullable=False)

class Inventory(db.Model):
    __tablename__='inventory'
    inventory_id=db.Column(db.Integer,primary_key=True)
    warehouse_id = db.Column(db.ForeignKey('warehouse.warehouse_id'), nullable=False)
    product_id = db.Column(db.ForeignKey('product.product_id'), nullable=False)
    quantity=db.Column(db.Integer,nullable=False)

class product(db.Model):
    __tablename__="product"
    product_id=db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String(50),nullable=False)
    category=db.Column(db.String(50),nullable=False)
    total_stock=db.Column(db.Integer)
    available_stock=db.Column(db.Integer)

class intransit(db.Model):
    __tablename__="intransit"
    intransit_id=db.Column(db.Integer,primary_key=True)
    product_id=db.Column(db.ForeignKey('product.product_id'),nullable=False)
    source_warehouse_id =db.Column(db.ForeignKey('warehouse.warehouse_id'),nullable=True)
    destination_warehouse_id =db.Column(db.ForeignKey('warehouse.warehouse_id'),nullable=True)
    quantity=db.Column(db.Integer,nullable=False)
    shipped_date=db.Column(db.Date,default=db.func.current_date())
    inward_outward=db.Column(db.String(100),nullable=False)

class delivery(db.Model):
    __tablename__="delivery"
    delivery_id=db.Column(db.Integer,primary_key=True)
    product_id=db.Column(db.ForeignKey('product.product_id'),nullable=False)
    warehouse_id=db.Column(db.ForeignKey('warehouse.warehouse_id'),nullable=False)
    quantity=db.Column(db.Integer,nullable=False)
    shipped_date = db.Column(db.DateTime)



    
