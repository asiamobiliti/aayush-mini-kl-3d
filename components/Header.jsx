import '../componentStyles/Header.css'
import Logo from './header/Logo';
import NavBar from './header/NavBar';

export default function Header({togglePopup}) {
    return (
        <header className='headerStyle'>
           <Logo />
           <NavBar togglePopup={togglePopup}/>
        </header>
    )
}