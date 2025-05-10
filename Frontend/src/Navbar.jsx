
import { Link } from "react-router-dom";
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import { FaTruckMoving } from "react-icons/fa"; 
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import { useState } from "react";
import "./App.css";

function Navbar() {
  

  const [menu, setMenu] = useState(false);

  const handleNavClick = () => {
    setMenu(false);
  };

  return (
    <div className="Navbar">
      <h2>Stock<strong>Flow</strong></h2>
      <div className="Navbar-div">
        <ul>
          <li className="nav" onClick={handleNavClick}>
            <Link to="/Dashboard">Dashboard<DashboardCustomizeIcon/></Link>
          </li>
          <li className="nav1" onClick={handleNavClick}>
            <Link to="/Warehouse">Warehouse<WarehouseIcon/></Link>
          </li>
          <li className="nav2" onClick={handleNavClick}>
            <Link to="/Inventory">Inventory< Inventory2Icon/></Link>
          </li>
          <li className="nav3" onClick={handleNavClick}>
            <Link to="/InTransit">
            InTransit <FaTruckMoving/>
            </Link>
          </li>
          
          <li className="nav4" onClick={handleNavClick}>
            <Link to="/Product">
            Product <ProductionQuantityLimitsIcon/>
            </Link>
          </li>
          <li className="nav5" onClick={handleNavClick}>
            <Link to="/Delivery">
            Delivery <DeliveryDiningIcon/>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
