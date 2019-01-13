import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
import Brain from  './Brain.png';



const Logo = () => {

    return (
        <div className='ma4 mt0'>
            <Tilt className="Tilt br3 shadow-2" options={{ max : 70 }} style={{ height: 150, width: 150 }} >
                <div className="Tilt-inner">
                <img  style={{paddingTop:'5px'}} alt = 'logo' src = {Brain}/>

                </div>
            </Tilt>

        </div>

    );
}

export default Logo;