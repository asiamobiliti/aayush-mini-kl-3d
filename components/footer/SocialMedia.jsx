import { useState } from "react";

export default function SocialMedia() {
    const [isLinkedIn, setIsLinkedIn] = useState(false);
    const [isWebsite, setIsWebsite] = useState(false); 
    const [isInstagram, setIsInstagram] = useState(false);  

    return (
        <div className="expandableContainer">
        <div className="socialMediaWrapper">
            <div 
                className="socialMediaButton"
                id="website"
                onMouseEnter={() => setIsWebsite(true)}
                onMouseLeave={() => setIsWebsite(false)}
                onClick={() => window.location.href="https://asiamobiliti.com/"}
            >
                <div className="socialMediaIcon">
                    <img 
                        src={isWebsite ? "../images/logoSocialHover.png" : "../images/logoSocial.png"} 
                        alt="A logo"
                    />
                </div>
                <span>Website</span>
            </div>     
            <div 
                className="socialMediaButton"
                id="linkedin"
                onMouseEnter={() => setIsLinkedIn(true)}
                onMouseLeave={() => setIsLinkedIn(false)}
                onClick={() => window.location.href="https://my.linkedin.com/company/asia-mobiliti"}
            >
                <div className="socialMediaIcon">
                    <img 
                        src={isLinkedIn ? "../images/linkedinHover.png" : "../images/linkedin.png"}
                        alt="L logo"
                    />
                </div>
                <span>LinkedIn</span>
            </div>  
            <div 
                className="socialMediaButton"
                id="instagram"
                onMouseEnter={() => setIsInstagram(true)}
                onMouseLeave={() => setIsInstagram(false)}
                onClick={() => window.location.href ="https://www.instagram.com/trekinmalaysia/?hl=en"}
            >
                <div className="socialMediaIcon">
                    <img 
                        src={isInstagram ? "../images/instagramHover.png" : "../images/instagram.png"}
                        alt="L logo"
                    />
                </div>
                <span>Instagram</span>
            </div>          
        </div>
        </div>
    )
}