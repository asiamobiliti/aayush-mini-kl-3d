import asiaMobilitiLogo from "../../images/logoLong.png"; // adjust path as needed

const dummyTiming1 = "11:00 13 Jun 2025";
const dummyTiming2 = "14:59 13 Jun 2025";

export default function LearnMorePopUp({ closePopup }) {
  return (
    <div className="learn-more-popup" style={{ position: "relative", paddingBottom: "60px", fontWeight: "600" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>About Mini KL 3D</h1>
        <span className="learn-more-close-button"
          onClick={closePopup}
        >
          ×
        </span>
      </div>
      <hr
        style={{
          border: "none",
          width: "65%",
          borderTop: "4px solid #568D82",
          margin: "0 0 10px 0"
        }}
      />
      <p style={{textAlign: "justify", lineHeight: "1.5", marginTop: "2.5rem", marginBottom: "1rem"}}>
        This data visualisation is provided by (GITHUB PROFILE). The source of the public
        transportation data in the app is the Asia Mobiliti TransitX API. They are based on
        real-time data captured from RapidKL public buses. The accuracy and integrity of the
        data are not guaranteed. Please do not contact the operators at Asia Mobiliti directly
        regarding the content of the app.
      </p>

      <p>
        For more information, refer to the document's source code at (GITHUB LINK).
      </p>

      <p><span>Last Update on Static Data: </span><strong style={{fontWeight: "700"}}>{dummyTiming1}</strong></p>
      <p><span>Last Update on Static Data: </span><strong style={{fontWeight: "700"}}>{dummyTiming2}</strong></p>
      <div
        style={{
          position: "absolute",
          right: "20px",
          bottom: "10px",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
      >
        <span style={{ fontSize: "19px", fontWeight: "600" }}>
          Powered By
        </span>
        <img
          src={asiaMobilitiLogo}
          alt="Asia Mobiliti"
          style={{ height: "22px", objectFit: "contain" }}
        />
      </div>
    </div>
  );
}
