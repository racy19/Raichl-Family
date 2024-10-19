import { Link, Outlet } from "react-router-dom";

const Page = () => {
  return (
    <>
      <nav className="navbar navbar-expand-sm navbar-light bg-success">
        <ul className="container navbar-nav mr-auto justify-content-start">
          <li className="nav-item">
            <Link to={"/"} className="nav-link text-white">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/people"} className="nav-link text-white">
              Osoby
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/people/create"} className="nav-link text-white">
              Přidat osobu
            </Link>
          </li>
        </ul>
      </nav>
      <div className="container mt-5">
        <Outlet />
      </div>
      <div id="footer" className="bg-dark mt-5">
        <div className="container text-white">
          footer
        </div>
      </div>
    </>
  )
}

export default Page;