/* eslint-disable max-len */
import React from 'react';
import { Link } from 'react-router-dom';
import {
  RESOURCE_LOCAL_URLS,
  RESOURCE_ROUTES,
  VIDEO_URL,
} from '../../constants';

import './style.scss';

const About = (_props) => {
  return (
    <div id="about-content">
      <div className="container" id="overview-text">
        <h1 id="title">Supporting Resources</h1>
      </div>
      <div className="about-content-container">
        <h3>Reliability and utility of prediction system</h3>
        <p><a href={VIDEO_URL}>{VIDEO_URL}</a></p>
        <br />
        <p>link to written description that matt has</p>
        <br />

        <h3>Data</h3>
        <p>SPB Monitoring and Prediction Team. 2022. Annual trapping data, spot data, and model predictions for each participating county, parish, or federal parcel, 1987-2021 ver 1. <Link to={RESOURCE_ROUTES.ANNUAL}>{RESOURCE_LOCAL_URLS.ANNUAL}</Link></p>
        <br />
        <p>SPB Monitoring and Prediction Team. 2022. Unreduced weekly trapping data for each participating county, parish, or federal parcel, 1987-2011, ver 1. <Link to={RESOURCE_ROUTES.WEEKLY_OLD}>{RESOURCE_LOCAL_URLS.WEEKLY_OLD}</Link></p>
        <br />
        <p>SPB Monitoring and Prediction Team. 2022. Unreduced weekly trapping data for each participating county, parish, or federal parcel, 2011-2017, ver 1. <Link to={RESOURCE_ROUTES.WEEKLY}>{RESOURCE_LOCAL_URLS.WEEKLY}</Link></p>
        <br />

        <h3>Code</h3>
        <p>SPB Monitoring and Prediction Team. 2022. Technical description with code of model employed by spbpredict.com, version 1. <Link to={RESOURCE_ROUTES.CODE}>{RESOURCE_LOCAL_URLS.CODE}</Link></p>
        <br />

        <h3>Some references on the population dynamics of southern pine beetles</h3>
        <p>Aoki, C. F. 2017. Forest risk and irruptive insect pests: ecology for management in changing times. Dissertation. Dartmouth College, Hanover, NH USA. (Chapter 3 developed the initial version of the zero-inflated Poisson model employed by spbpredict.com, version 1.) <Link to={RESOURCE_ROUTES.DISSERTATION}>{RESOURCE_LOCAL_URLS.DISSERTATION}</Link></p>
      </div>
    </div>
  );
};

export default About;
