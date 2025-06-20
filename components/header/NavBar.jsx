import SearchBar from "./SearchBar";

export default function NavBar({ togglePopup }) {
    return (
            <nav className="glass-navbar">
                <a id="track-ride" href="">TRACK YOUR RIDE</a>
                <SearchBar />
                <a id="learn-more" onClick={togglePopup}>LEARN MORE</a>
            </nav>
    )
}