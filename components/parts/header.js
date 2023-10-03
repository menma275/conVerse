import Dropdown from "@/components/parts/dropdown";

const Header = () => {
  return (
    <header>
      <div className="header pixel-shadow">
        <h1>Gundi</h1>
        <div className="user">
          <Dropdown />
        </div>
      </div>
    </header>
  );
};
export default Header;
