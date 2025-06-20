import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer"
import MapView from './components/MapView';
import LearnMorePopUp from "./components/LearnMorePopUp";
import { ViewStateContext } from "./components/ViewStateContext";

function App() {
  const [viewState, setViewState] = useState({
    longitude: 101.685662,
    latitude: 3.102799,
    zoom: 14.8,
    pitch: 60, 
    bearing: 30
  });

  const [userLocation, setUserLocation] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => setShowPopup(prev => !prev);
  const closePopup = () => setShowPopup(false);

  return (
    <ViewStateContext.Provider value={{ viewState, setViewState }}>
      <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
        <Header togglePopup={togglePopup}/>
        <MapView userLocation={userLocation} setUserLocation={setUserLocation}/>
        {showPopup && <LearnMorePopUp closePopup={closePopup}/>}
        <Footer userLocation={userLocation} />
      </div>
    </ViewStateContext.Provider>
  )
}

export default App