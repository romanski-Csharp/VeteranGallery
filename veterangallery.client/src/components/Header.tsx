import { MilitaryBranch } from '../types/veteran';

interface Props {
    onFilterChange: (branch: number | null) => void;
}

const Header = ({ onFilterChange }: Props) => {
    return (
        <header className="header">
            <h1>VETERAN GALLERY</h1>
            <nav className="filter-nav">
                <button onClick={() => onFilterChange(null)}>All</button>
                <button onClick={() => onFilterChange(MilitaryBranch.LandForces)}>Land Forces</button>
                <button onClick={() => onFilterChange(MilitaryBranch.AirForce)}>Air Force</button>
                <button onClick={() => onFilterChange(MilitaryBranch.Navy)}>Navy</button>
            </nav>
        </header>
    );
};

export default Header;