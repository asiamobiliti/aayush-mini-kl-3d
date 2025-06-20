import '../componentStyles/Footer.css';
import ZoneButton from './footer/ZoneButton';
import ToggleButtons from './footer/ToggleButtons';
import SocialMedia from './footer/SocialMedia';

export default function Footer({userLocation}) {
    return (
        <footer className="footerStyle">
            <ZoneButton />
            <ToggleButtons userLocation={userLocation}/>
            <SocialMedia />
        </footer>
    );
}
