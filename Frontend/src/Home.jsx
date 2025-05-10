import React from 'react'
import FactoryIcon from '@mui/icons-material/Factory';
import FireTruckIcon from '@mui/icons-material/FireTruck';
import GridViewIcon from '@mui/icons-material/GridView';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { Button } from '@mui/material';

const Home = () => {
  return (
    <div className="home-container">
      <FactoryIcon className="icon factory-icon"/>
      <h1 className="header-text">
     <span className='h1-home'>Efficient</span> 
   {/* <span className="flip-container"> */}

    <span className="flip-text inventory">Inventory</span>
    <span className="flip-text warehouse">Warehouse</span>
  {/* </span> */}
  <br />
 <span className='h3_home'> systems are key to </span><br /> <span className="h2_home"> smooth business</span>
</h1>


      <FireTruckIcon className="icon firetruck-icon"/>
      <GridViewIcon className="icon gridview-icon"/>
      <TextSnippetIcon className="icon textsnippet-icon"/>
      {/* <Button className='join-button'>Join us</Button> */}
    </div>
  )
}

export default Home;
