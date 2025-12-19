import '../styles/header-footer.css';

function Header() {
  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <header className="dashboard-header">
      <div className="container-fluid">
        <div className="header-container d-flex align-items-center justify-content-between flex-wrap">

          <div className="logo-container d-flex align-items-center">
            <img src="/images/LOGO.jpg" alt="Uttar Pradesh Government Logo" style={{ maxWidth: '80px', marginRight: '10px' }} />
            <div className="site-title">
              <h1>Urban Storm Water Drainage Scheme</h1>
            </div>
          </div>

          <nav className="main-nav">
            <ul className="nav-menu d-flex list-unstyled mb-0">
              <li className="nav-item"><a href="#" className="nav-link">Dashboard</a></li>
              <li className="nav-item dropdown">
                <a href="#" className="nav-link">Projects <i className="fas fa-chevron-down"></i></a>
                <ul className="dropdown-menu">
                  <li><a href="#" className="dropdown-item">All Projects</a></li>
                  <li><a href="#" className="dropdown-item">Ongoing</a></li>
                  <li><a href="#" className="dropdown-item">Completed</a></li>
                  <li><a href="#" className="dropdown-item">Upcoming</a></li>
                </ul>
              </li>
              <li className="nav-item"><a href="#" className="nav-link">Reports</a></li>
              <li className="nav-item"><a href="#" className="nav-link">Resources</a></li>
            </ul>
          </nav>

          <div className="header-right d-flex align-items-center">
            <div className="search-container me-3">
              <input type="text" placeholder="Search..." />
              <button type="submit"><i className="fas fa-search"></i></button>
            </div>

            <div className="user-menu d-flex align-items-center">
              <div className="user-avatar me-2"><i className="fas fa-user"></i></div>
              <span className="me-2">Admin</span>
              <button onClick={logout} className="btn btn-sm btn-outline-danger">Logout</button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}

export default Header;
