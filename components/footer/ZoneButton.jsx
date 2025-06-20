export default function ZoneButton() {
    return (
        <button
                onClick={() => console.log('Zone button clicked')}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}
            >
                <svg className="zoneButtonContainer" width="200" height="54">
                    <line x1="15" y1="23" x2="35" y2="23" stroke="#000000" strokeWidth="2" />
                    <line x1="15" y1="27" x2="35" y2="27" stroke="#000000" strokeWidth="2" />
                    <line x1="15" y1="31" x2="35" y2="31" stroke="#000000" strokeWidth="2" />

                    <text 
                        x="45"
                        y="28"
                        fill="#000000"
                        fontSize="18"
                        fontWeight={600}
                        fontFamily="Montserrat, sans-serif"
                        dominantBaseline="middle"
                    >
                        Choose Zone
                    </text>
                </svg>
            </button>
    )
}