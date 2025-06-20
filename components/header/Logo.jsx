export default function Logo() {
    const handleClick = () => console.log('clicked');
    return(
        <button className='logoContainer' onClick={handleClick} style={{cursor: 'pointer'}}>
            <img className='logoImage' src="../images/logo.png" alt="logo icon"/>
            <img className='logoImageHover' src="../images/logo-hover.png" alt="logo hover icon"/>
        </button>
    );
}