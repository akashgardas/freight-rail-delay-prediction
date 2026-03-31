# Short-Term Arrival Delay Time Prediction in Freight Rail Operations
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)


## 🌐 Live Demo

**Access the interactive web application here:** [Freight Rail Delay Prediction System](https://freight-rail-delay-prediction-system.streamlit.app/)

## 📌 Overview

This project presents a machine learning–based framework for **short-term arrival delay time prediction in freight rail operations**. By leveraging historical operational data, the system models delay patterns and propagation effects to improve arrival time reliability and support data-driven operational planning. The solution is deployed as an interactive web application for real-time delay estimation.

## 🎯 Objectives

  * Analyze historical freight rail operational data to identify delay patterns
  * Develop predictive models for short-term arrival delay estimation
  * Improve scheduling accuracy and operational efficiency
  * Support decision-making in freight rail transportation systems through an accessible user interface

## 🧠 Methodology

1.  **Data Collection & Understanding**
    Historical freight rail operational datasets containing arrival times, delays, and related attributes.

2.  **Data Preprocessing**

      * Data cleaning and handling missing values
      * Feature selection, engineering (e.g., weight per length/wagon), and transformation
      * Delay normalization and standardization

3.  **Model Development**

      * Machine learning models trained for short-term delay prediction
      * Performance evaluation using appropriate regression metrics (RMSE, R², MAPE)

4.  **Prediction & Analysis**

      * Estimation of arrival delay time
      * Analysis of prediction accuracy and error trends

## 🛠️ Technologies Used

  * Python
  * Pandas, NumPy
  * Scikit-learn
  * **Streamlit** (for web application deployment)
  * Jupyter Notebook

## 📊 Results

The proposed framework demonstrates the feasibility of predicting short-term arrival delays in freight rail operations, highlighting the potential of machine learning techniques to enhance operational reliability and efficiency.

## 📂 Repository Structure

```text
├── data/                 # Dataset files (if permitted)
├── notebooks/            # Jupyter notebooks for analysis and modeling
├── src/                  # Source code for the Streamlit app (app.py) and preprocessing
├── models/               # Trained models (.joblib) and scalers
├── results/              # Evaluation results and visualizations
└── README.md
```

## 🚀 Future Work

  * Integration of real-time operational live-feeds
  * Advanced temporal and deep learning models
  * Enterprise integration into existing decision-support dispatch systems
  * Scalability analysis for large rail networks

## 📄 License

This project is licensed under the **MIT License**, permitting reuse, modification, and distribution for academic, and research purposes, provided that proper attribution is given to the original author(s).
See the `LICENSE` file for full license text.