import { useContext, useRef } from "react"
import { ViewStateContext } from "../ViewStateContext"
import { FlyToInterpolator } from "deck.gl";

export default function ToggleButtons({userLocation}) {
    const { setViewState } = useContext(ViewStateContext);
    const zoomIntervalRef = useRef(null);
    
    const zoomOut = () => {
        setViewState(prev => ({
            ...prev,
            zoom: Math.max(prev.zoom - 0.02, 0)
        }))
    };
    const zoomIn = () => {
        setViewState(prev => ({
        ...prev,
        zoom: Math.min(prev.zoom + 0.02, 20)
        }));
    };

    const startZoom = (zoomFn) => {
        zoomFn(); // Immediate zoom
        zoomIntervalRef.current = setInterval(() => {
        zoomFn();
        }, 0.1); // Repeat every 100ms
    };

    const stopZoom = () => {
        clearInterval(zoomIntervalRef.current);
        zoomIntervalRef.current = null;
    };

    const recenter = () => {
        console.log(userLocation);
        if (!userLocation) {
            console.warn('User location not available yet');
            return;
        }
        setViewState(prev => ({
            ...prev,
            longitude: userLocation.longitude,
            latitude: userLocation.latitude,
            zoom: 17,
            bearing: 0,
            transitionDuration: 500,
            transitionInterpolator: new FlyToInterpolator()
        }));
    }

    const toggleFullScreen = () => {
        const elem = document.documentElement; // or any specific element
        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div className="toggleButtons">
            <button
                onMouseDown={() => startZoom(zoomIn)}
                onMouseUp={stopZoom}
                onMouseLeave={stopZoom}
                onTouchStart={zoomIn}
                onTouchEnd={stopZoom}
                style={{ background: 'none', border: 'none', padding: 0, cursor: "pointer" }}
            >
                <svg id="firstButton" className="toggleButtonContainer" width="66" height="55">
                    <image
                        href="../images/toggleButtonPlus.png"
                        x="22"
                        y="16"
                        height="25"
                        width="25"
                    />
                </svg>
            </button>
            <svg width="1" height="55">
                <line
                    x1="1"
                    y1="0"
                    x2="1"
                    y2="55"
                    stroke="black"
                    strokeWidth="2"
                />
            </svg>
            <button
                onMouseDown={() => startZoom(zoomOut)}
                onMouseUp={stopZoom}
                onMouseLeave={stopZoom}
                onTouchStart={() => startZoom(zoomOut)}
                onTouchEnd={stopZoom}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
                <svg className="toggleButtonContainer" width="66" height="55">
                    <image
                        href="../images/toggleButtonMinus.png"
                        x="18"
                        y="14"
                        height="30"
                        width="30"
                    />
                </svg>
            </button>
            <svg width="1" height="55">
                <line
                    x1="1"
                    y1="0"
                    x2="1"
                    y2="55"
                    stroke="black"
                    strokeWidth="2"
                />
            </svg>
            <button
                onClick={() => {
                    recenter()
                    console.log('Toggle button clicked');
                }}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
                <svg className="toggleButtonContainer" width="66" height="55">
                    <image
                       href="../images/toggleButtonNavigate.png"
                        x="17"
                        y="14"
                        height="31"
                        width="31"
                    />
                </svg>
            </button>
            <svg width="1" height="55">
                <line
                    x1="1"
                    y1="0"
                    x2="1"
                    y2="55"
                    stroke="black"
                    strokeWidth="2"
                />
            </svg>
            <button
                onClick={toggleFullScreen}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
                <svg className="toggleButtonContainer" width="66" height="55">
                    <image
                        href="../images/toggleButtonZoom.png"
                        x="17"
                        y="14"
                        height="30"
                        width="30"
                    />
                </svg>
            </button>
            <svg width="1" height="55">
                <line
                    x1="1"
                    y1="0"
                    x2="1"
                    y2="55"
                    stroke="black"
                    strokeWidth="2"
                />
            </svg>
            <button
                onClick={() => console.log('Toggle button clicked')}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
                <svg id="lastButton"className="toggleButtonContainer" width="66" height="55">
                    <image
                        href="../images/toggleButtonCamera.png"
                        x="14"
                        y="10"
                        height="37"
                        width="37"
                    />
                </svg>
            </button>
        </div>
    )
}