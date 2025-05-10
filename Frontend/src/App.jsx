import Dashboard from './Dashboard'
import Navbar from './Navbar'
import Home from './Home'
import Inventory from './Inventory'
import Warehouse from './Warehouse'
import InTransit from './Intransit'
import Delivery from './Delivery'
import Product from './Product'
import WarehouseRead from'./WarehouseRead'
import {BrowserRouter, Routes,Route} from 'react-router-dom'
function App() {
  return (
    <BrowserRouter>
     <Navbar />
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/Dashboard' element={<Dashboard />}></Route>
      <Route path='/Inventory' element={<Inventory />}></Route>
      <Route path='/Warehouse' element={<Warehouse />}></Route>
      <Route path='/InTransit' element={<InTransit />}></Route>
      <Route path='/Product' element={<Product />}></Route>
      <Route path='/Delivery' element={<Delivery />}></Route>

    </Routes>
    </BrowserRouter>
  )
}

export default App
