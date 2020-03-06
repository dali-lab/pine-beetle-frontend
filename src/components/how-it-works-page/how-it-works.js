import React from 'react';
import "../../styles/how-it-works-page/How-it-works.css"

const HowItWorks = (props) => { 
    return(
        <div>
            <div className = "top-photo">
                <img src={require("../../assets/Trees.png")} alt = "Trees" class = "responsive"></img>
            </div>
            <div className = "rectangle-box">
                <div className = 'how'>
                    <br></br><br></br>How the Model Works
                </div>
                <br></br>Outbreaking insects can cause millions of acres of damage to forests, even when the insects are native. Predicting when outbreaks occur can assist forest managers in planning for financial and personnel needs that arise during widespread outbreak, If outbreaks occur on a regular cycle, as some do,they are relatively easy to preditct. Souther pine beetle outbreaks, on the other hand, do not occur regularly. In many locations, they may be virtually invisible for many years or even decades before irrupting into an outbreak. They may then outbreak again shortly thereafter, or retreat again for years at a time. Developing a quantitative model for such a system is challenging. We got there by following the steps in the below sections.
            </div>
            <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
            <div className = "long-line">
                <div className = "dot-container">
                    <img src={require("../../assets/colored-dots-ns.png")} alt = "dots" class = "responsive"></img>
                </div>
            </div>
            <br></br>
            <div class = "row">
                <div class = "column">
                    <div class = "galleryP">
                        <img src={require("../../assets/pink-img.png")} alt = "pink" class = "responsive"></img>
                    </div>
                </div>
                <div class = "column">
                    <div class = "galleryB">
                        <img src={require("../../assets/blue-img.png")} alt = "blue" class = "responsive"></img>
                    </div>
                </div>
                <div class = "column">
                    <div class = "galleryO">
                        <img src={require("../../assets/orange-img.png")} alt = "orange" class = "responsive"></img>
                    </div>
                </div>
                <div class = "column">
                    <div class = "galleryG">
                        <img src={require("../../assets/green-img.png")} alt = "green" class = "responsive"></img>
                    </div>
                </div>
            </div>
            <div class = "row2">
                <div class = "column2">
                    <div class = "gallery-text1">
                        MODEL THE OUTBREAKS
                    </div>
                </div>
                <div class = "column2">
                    <div class = "gallery-text2">
                        USE A STATISTICAL MODEL
                    </div>
                </div>
                <div class = "column2">
                    <div class = "gallery-text3">
                        APPLY ZERO-INFLATION
                    </div>
                </div>
                <div class = "column2">
                    <div class = "gallery-text4">
                        TEST INPUT VARIABLES
                    </div>
                </div>
            </div>
            <br></br>
            <div class = "rectangle-box-bottom">
                <br></br><br></br>
                <div class = "mo-txt">
                    <div class = "txt-header">
                        <div class = 'acorn'>
                            <img src={require("../../assets/acorn.png")} alt = "acorn" class = "responsive"></img>
                        </div>
                        Model the Outbreaks
                    </div>
                    <br></br>We decided not to use traditional modeling techniques that involve modeling the beetles themselves; instead we model the number of infestations, commonly referred to as “spots.” Complex population models are often difficult to fit to real data, so we opted for an approach that would allow us to use spot data that was already being collected by state forest service agencies and their federal counterparts. 
                </div>
                <br></br>
                <div class = "row3">
                    <div class = "column3">  
                        <img src={require("../../assets/model_dynamics.png")} alt = "model" class = "model-dynamics responsive"></img>
                    </div>
                    <div class = "column3">
                        <div class = "less-txt">
                            <div class = "txt-header">
                                <div class = 'acorn'>
                                    <img src={require("../../assets/acorn.png")} alt = "acorn" class = "responsive"></img>
                                </div>
                                Use a Statistical Model
                            </div>
                            <br></br>Rather than using a complex mathematical model, we used a statistical method known as “zero-inflation.” It’s basically a fancy version of regression, one of the most basic statistical techniques.
                            <br></br><br></br>
                            <div class = "txt-header">
                                <div class = 'acorn'>
                                    <img src={require("../../assets/acorn.png")} alt = "acorn" class = "responsive"></img>
                                </div>
                                Zero Inflation
                            </div>
                            <br></br>Because most locations in most years are not in outbreak, a very large number of zeros occurs in the data over the course of the three decades that data have been collected. This means that traditional statistics methods cannot be applied. Zero-inflation, however, is designed for precisely this kind of data, and we think it might prove to be a robust method for other kinds of irregularly outbreaking insects—not just SPB.
                        </div>
                    </div>
                </div>
                <br></br>
                <div class = "mo-txt">
                    <div class = "txt-header">
                    <br></br>
                        <div class = 'acorn'>
                            <img src={require("../../assets/acorn.png")} alt = "acorn" class = "responsive"></img>
                        </div>
                        Test Input Variables
                    </div>
                    <br></br>In any prediction model, there are “predictor variables” that help determine the prediction. For example, some combination of temperature, precipitation, and soil nutrients might predict crop productivity. To create our model of outbreak probability, we tested the following potential predictor variables: # of SPB, # of clerids, ratio of SPB/clerids, the three preceding variables both this year and last year, # of spots last year, and # of spots the year before. We also tested the size of the forest resource in each location (how many acres of SPB host trees were available). Of these, only # of SPB this year, # of clerids last year, and the two previous years of spot numbers were helpful in predicting the probability of outbreak. We continue to use these four variables in creating our model predictions. We will evaluate the predictor variables each year, potentially adding more in the future.   
                </div>
                <br></br><br></br>
            </div>
        </div>
    );
};
export default HowItWorks;