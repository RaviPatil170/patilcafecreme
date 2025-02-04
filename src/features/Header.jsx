import React, { useState } from 'react';

//import burgerImage from './right side/burger.png';
//import pngwing2 from '/right side/pngwing.com (12).png';

import "./Header.css"
const burgerImage ='/right side/burger.png';
const pngwing2 ='/right side/buger2.png';
const pngwing3 ='/right side/pngwing.com (12).png';
const pngwing4 ='/right side/Flying Burger PNG Image - 2084x2084.png';
const pngwing5 ='/right side/pngwing.com (16).png'
export default function Header() {
    //let toggle_image_address=;
    const [toggle_image_address,setToggle_image_address]=useState('/right side/Flying Burger PNG Image - 2084x2084.png')
    function toggleBurger(e,src,){
    console.log(src);
            setToggle_image_address(()=>src);

    }
  return (
    <header>
      <div className="text">
        <h1>
          THE ULTIMATE <br />
          PATIL'S CAFE
        </h1>
        <p>
          Crispy fries, golden brown and hot,<br/>
           A perfect pairing, can't be forgot.<br/>
            With coffee's warmth, a simple treat,<br/>
           A tasty moment,oh so sweet.
        </p>
        <div className="buttons-section">
          <a href="" className="btn">
            Order Now
          </a>
          <a href="" className="btn">
            View More
          </a>
        </div>
      </div>
      <div className="burger">
        <img
          src={burgerImage}
          alt="burger iamage"
          onClick={(e) => toggleBurger(e, burgerImage)}
        ></img>
        <img
          src={pngwing2}
          alt="pngwing.com (12)"
          onClick={(e) =>
            toggleBurger(e, pngwing2)
          }
        ></img>
        <img
          src={pngwing3}
          alt="burger2 iamage"
          onClick={(e) => toggleBurger(e, pngwing3)}
        ></img>
        <img
          src={pngwing4}
          alt="Flying Burger PNG Image - 2084x2084"
          onClick={(e) =>
            toggleBurger(
              e,
              pngwing4
            )
          }
        ></img>
        <img
          src={pngwing5}
          alt="pngwing.com (16)"
          onClick={(e) =>
            toggleBurger(e, pngwing5)
          }
        ></img>
      </div>
      <div className="burger-toggle">
        <img
          src={toggle_image_address}
          alt={toggle_image_address}
          className="active"
        ></img>
      </div>
    </header>
  );
}
