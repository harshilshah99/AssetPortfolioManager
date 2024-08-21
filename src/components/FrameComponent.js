import PropTypes from "prop-types";
import "./css/framecomponent.css";

const FrameComponent = ({ className = "" }) => {
  return (
    <div className={`frame-parent5 ${className}`}>
      <div className="exchange-parent">
        <div className="exchange" />
        <b className="tp">TP</b>
      </div>
      <div className="watchlist-header-parent">
        <div className="watchlist-header">
          <div className="ai-watchlist">AI WATCHLIST</div>
        </div>
        <div className="watchlist-item-parent">
          <div className="second-watchlist-item">
            <div className="watchlist-item-details">
              <div className="watchlist-item-details-child" />
              <div className="sp-parent">
                <b className="sp1">{`S&P`}</b>
                <div className="watchlist-item-value">
                  <div className="microsoftteamsimage">500</div>
                </div>
              </div>
            </div>
            <div className="watchlist-item-price1">
              <div className="watchlist-item-price-details">
                <b className="sp-5002">{`S&P 500`}</b>
                <div className="zap">4,549.78</div>
              </div>
            </div>
          </div>
          <div className="watchlist-item-percentage">
            <div className="watchlist-item-percentage-deta">
              <div className="new-ai-success">+0.30%</div>
              <div className="watchlist-item-percentage1">+13.02</div>
            </div>
          </div>
        </div>
      </div>
      <div className="revanth-k-wrapper">
        <div className="revanth-k">
          <div className="second-watchlist-item">
            <div className="watchlist-item-details">
              <div className="watchlist-item-details-child" />
              <div className="sp-parent">
                <div className="sp2">{`S&P`}</div>
                <div className="second-watchlist-item-value">
                  <div className="microsoftteamsimage">500</div>
                </div>
              </div>
            </div>
            <div className="second-watchlist-item-price">
              <div className="watchlist-item-price-details">
                <b className="sp-5002">{`S&P 500`}</b>
                <div className="zap">4,549.78</div>
              </div>
            </div>
          </div>
          <div className="watchlist-item-percentage">
            <div className="watchlist-item-percentage-deta">
              <div className="new-ai-success">+0.30%</div>
              <div className="watchlist-item-percentage1">+13.02</div>
            </div>
          </div>
        </div>
      </div>
      <div className="support-sub-menu">
        <div className="main-menu">MAIN MENU</div>
      </div>
      <div className="navigation-menu-wrapper">
        <div className="navigation-menu">
          <div className="navigation-sub-menu">
            <img
              className="home-2-icon"
              loading="lazy"
              alt=""
              src="/home2.svg"
            />
            <div className="navigation-sub-sub-menu">
              <div className="home">Home</div>
            </div>
          </div>
          <div className="navigation-sub-menu">
            <img
              className="home-2-icon"
              loading="lazy"
              alt=""
              src="/convert3dcube.svg"
            />
            <div className="navigation-sub-sub-menu">
              <div className="exchange1">Exchange</div>
            </div>
          </div>
        </div>
      </div>
      <div className="status-up-parent">
        <img
          className="home-2-icon"
          loading="lazy"
          alt=""
          src="/statusup.svg"
        />
        <div className="fund-label">
          <div className="stock-fund">{`Stock & Fund`}</div>
        </div>
        <img className="home-2-icon" loading="lazy" alt="" src="/arrowup.svg" />
      </div>
      <div className="filter-container-wrapper">
        <div className="filter-container">
          <div className="filter-options">
            <div className="filter-selector">
              <div className="coin" />
              <div className="filter-dropdown">
                <div className="filter-items">
                  <div className="stocketf">Stock/ETF</div>
                  <div className="index1">Index</div>
                  <div className="currency">Currency</div>
                  <div className="mutual-fund">Mutual Fund</div>
                </div>
              </div>
            </div>
          </div>
          <div className="frame-parent6">
            <div className="frame-parent7">
              <div className="wallet-3-parent">
                <img className="home-2-icon" alt="" src="/wallet3.svg" />
                <div className="wallets">Wallets</div>
              </div>
              <img className="home-2-icon" alt="" src="/arrowdown.svg" />
            </div>
            <div className="trade-parent">
              <img
                className="home-2-icon"
                loading="lazy"
                alt=""
                src="/trade.svg"
              />
              <div className="crypto">Crypto</div>
            </div>
          </div>
        </div>
      </div>
      <div className="navigation-menu-wrapper">
        <div className="support">SUPPORT</div>
      </div>
      <div className="help-menu-wrapper">
        <div className="navigation-menu">
          <div className="navigation-sub-menu">
            <img
              className="home-2-icon"
              loading="lazy"
              alt=""
              src="/people.svg"
            />
            <div className="navigation-sub-sub-menu">
              <div className="community">Community</div>
            </div>
          </div>
          <div className="navigation-sub-menu">
            <img
              className="home-2-icon"
              loading="lazy"
              alt=""
              src="/call.svg"
            />
            <div className="navigation-sub-sub-menu">
              <div className="help-support">{`Help & Support`}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

FrameComponent.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent;
