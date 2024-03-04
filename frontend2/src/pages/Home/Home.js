import React from "react";
import { RiProductHuntLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import "./Home.scss";
import heroImg from "../../assets/inv-img.png";
import uniper from "../../assets/Uniper_logo.png";
import { ShowOnLogin, ShowOnLogout } from "../../components/protect/HiddenLink";//CHEXKOUT

const Home = () => {
  return (
    <div className="home">
      <nav className="container --flex-between ">
      <div className="logo">
        <img src={uniper} alt="" style={{ width: '50px', height: 'auto' }} />
      </div>


        <ul className="home-links">
          <ShowOnLogout>
            <li>
              <Link to="/register">sing up</Link>
            </li>
          </ShowOnLogout>
          <ShowOnLogout>
            <li>
              <button className="--btn --btn-primary">
                <Link to="/login">Login</Link>
              </button>
            </li>
          </ShowOnLogout>
          <ShowOnLogin>
            <li>
              <button className="--btn --btn-primary">
                <Link to="/dashboard">Dashboard</Link>
              </button>
            </li>
          </ShowOnLogin>
        </ul>
      </nav>
      {/* HERO SECTION */}
      <section className="container hero">
        <div className="hero-text">
          <h2>Request {"&"} Process System Solution</h2>
          <p>
          Our request system simplifies tasks by offering easy search and filters, and it smoothly integrates requests from other systems to enhance overall efficiency.

          </p>
          <div className="hero-buttons">
            <button className="--btn --btn-secondary">
              <Link to="/dashboard">Start Now</Link>
            </button>
          </div>
          {/* <div className="--flex-start">
            <NumberText num="14K" text="Brand Owners" />
            <NumberText num="23K" text="Active Users" />
            <NumberText num="500+" text="Partners" />
          </div> */}
        </div>
{/* 
        <div className="hero-image">
          <img src={heroImg} alt="Inventory" />
        </div> */}
      </section>
    </div>
  );
};

const NumberText = ({ num, text }) => {
  return (
    <div className="--mr">
      <h3 className="--color-white">{num}</h3>
      <p className="--color-white">{text}</p>
    </div>
  );
};

export default Home;
