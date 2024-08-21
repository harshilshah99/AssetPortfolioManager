import PropTypes from "prop-types";
import "./css/portfoliocard.css";

const PortfolioCard = ({ className = "", lineGraph }) => {
  return (
    <div className={`portfolio-card2 ${className}`}>
      <div className="card-containers">
        <div className="logo">
          <div className="logo-child" />
          <img className="apple-icon2" loading="lazy" alt="" src="/apple.svg" />
          <div className="logo1">
            <div className="apple-inc2">Apple, Inc</div>
          </div>
        </div>
        <div className="symbol">
          <div className="symbol1">
            <div className="symbol2">
              <div className="aapl2">AAPL</div>
            </div>
            <div className="price-change">+0.66%</div>
          </div>
        </div>
      </div>
      <div className="performance">
        <div className="performance1">
          <a className="portfolio3">Portfolio</a>
          <b className="performance-graph1">15,215.70</b>
        </div>
        <div className="performance-graph2">
          <img
            className="line-graph-icon"
            loading="lazy"
            alt=""
            src={lineGraph}
          />
        </div>
      </div>
    </div>
  );
};

PortfolioCard.propTypes = {
  className: PropTypes.string,
  lineGraph: PropTypes.string,
};

export default PortfolioCard;
