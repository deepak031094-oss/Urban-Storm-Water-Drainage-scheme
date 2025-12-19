import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/dashboard.css';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const dashboardCards = [
    { title: 'Component Wise', icon: 'fa-th-large', bg: 'bg-yellow' },
    { title: 'District Wise', icon: 'fa-map-marker-alt', bg: 'bg-orange' },
    { title: 'ULB Wise', icon: 'fa-city', bg: 'bg-orange' },
    { title: 'Project Status', icon: 'fa-tasks', bg: 'bg-brown' },
    { title: 'MAP View', icon: 'fa-map', bg: 'bg-pink' },
    { title: 'Project On MAP', icon: 'fa-map-marked-alt', bg: 'bg-pink' },
    { title: 'ULB and Project On MAP', icon: 'fa-project-diagram', bg: 'bg-pink' },
    { title: 'DPR (Detailed Project Report)', icon: 'fa-file-alt', bg: 'bg-pink', path: '/dpr' },
  ];

  return (
    <>
      <Header />
      <section className="progress-section py-3">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="progress-container">
                <div className="d-flex justify-content-between mb-2">
                  <span>UC Receipt</span>
                  <span>0%</span>
                </div>
                <div className="progress">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: '0%' }}
                    aria-valuenow={0}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="dashboard-main py-4">
        <div className="container-fluid">
          <div className="row g-4">
            {dashboardCards.map((card, idx) => (
              <div className="col-md-3" key={idx}>
                <div
                  className={`dashboard-btn ${card.bg}`}
                  onClick={() => card.path && navigate(card.path)}
                  style={{ cursor: card.path ? 'pointer' : 'default' }}
                >
                  <span>{card.title}</span>
                  <div className="btn-icon">
                    <i className={`fas ${card.icon}`}></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Dashboard;
