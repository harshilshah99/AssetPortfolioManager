import PropTypes from "prop-types";
import "./css/searchbarnotifications.css";

const SearchBarNotifications = ({ className = "" }) => {
  return (
    <header className={`search-bar-notifications ${className}`}>
      <div className="search-bar">
        <img className="search-normal-icon" alt="" src="/searchnormal.svg" />
        <input
          className="search-label"
          placeholder={`Search for stocks & more`}
          type="text"
        />
      </div>
      <div className="notification-area">
        <div className="notification-icon-container">
          <div className="notification-background-parent">
            <div className="notification-background" />
            <img
              className="notification-icon"
              loading="lazy"
              alt=""
              src="/notification.svg"
            />
          </div>
        </div>
        <div className="notification-count">
          <img
            className="notification-circle-icon"
            loading="lazy"
            alt=""
            src="/ellipse-81@2x.png"
          />
        </div>
        <div className="user-profile">
          <a className="barnabas-inyangsam">Barnabas Inyangsam</a>
          <div className="barnabasinvestcom">barnabas@invest.com</div>
        </div>
      </div>
    </header>
  );
};

SearchBarNotifications.propTypes = {
  className: PropTypes.string,
};

export default SearchBarNotifications;
