import React, { useState } from 'react'
import "./Header.css"
export default function Header() {
    //let toggle_image_address=;
    const [toggle_image_address,setToggle_image_address]=useState('../public/right side/Flying Burger PNG Image - 2084x2084.png')
    function toggleBurger(e,src,){
    console.log(src);
            setToggle_image_address(()=>src);

    }
  return (
    <header>
      <div className="text">
        <h1>THE ULTIMATE <br/>BURGER SHOP</h1>
        <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta,
        corporis. Architecto at animi ratione officiis saepe,cumque explicabo
        nihil nulla corporis, eveniet, quas ea voluptatem laboriosam atque
        maiores. Dicta, beatae.
        </p>
        <div className='buttons-section'>
        <a href='' className='btn'>Order Now</a>
        <a href='' className='btn'>View More</a>
        </div>
      </div>
      <div className='burger'>
        <img src='../public/right side/burger.png' alt="burger iamage" onClick={(e)=>toggleBurger(e,'../public/right side/burger.png')}></img>
        <img src='../public/right side/pngwing.com (12).png' alt="pngwing.com (12)" onClick={(e)=>toggleBurger(e,'../public/right side/pngwing.com (12).png')} ></img>
        <img src='../public/right side/buger2.png' alt="burger2 iamage" onClick={(e)=>toggleBurger(e,'../public/right side/buger2.png')}></img>
        <img src='../public/right side/Flying Burger PNG Image - 2084x2084.png' alt="Flying Burger PNG Image - 2084x2084" onClick={(e)=>toggleBurger(e,'../public/right side/Flying Burger PNG Image - 2084x2084.png')}></img>
        <img src='../public/right side/pngwing.com (16).png' alt="pngwing.com (16)" onClick={(e)=>toggleBurger(e,'../public/right side/pngwing.com (16).png')}></img>
        
      </div>
      <div className='burger-toggle'>
        <img src={toggle_image_address} alt={toggle_image_address} className="active"></img>
      </div>
    </header>
  );
}
