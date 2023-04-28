import { render } from '@testing-library/react';
import axios from 'axios';
import './App.css';
import React, { useState, useEffect, useCallback } from 'react';

import {Line} from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';

Chart.register(CategoryScale);

const options = {
  scales: {
    y: {
      ticks: {
        beginAtZero: true
      }
    }
  },
  plugins: {
    title: {
      display: true,
      text: 'My Chart Title'
    }
  }
};

function Unemployment() {
  
  const [data, setter] = useState(null);
  let API_TOKEN = process.env.REACT_APP_UN_API;

  
  useEffect(() => {
    async function fetchUn() {
      
      const response = await axios.get(`https://www.econdb.com/api/series/URATEUS/?token=${API_TOKEN}&format=json`);
      setter(response.data.data);
    }

    fetchUn();
  },[]);
    
  try {
    console.log(data);
    
    const d = {
      labels : data.dates,
      datasets : [
        {
          label: 'Unemployment Percentage',
          data: data.values,
          fill : true,
          borderColor: 'rgba(75,192,1)'
        }
      ]
    };
    options.plugins.title.text = 'Unemployment';
    return (
      <Line data={d} options={options}/>
    );
  }
  catch(error) {
    console.error(error);
  }

}

function WSB() {
  const [data, setter] = useState(null);

  useEffect(() => {
    async function fetchWSB() {
      
      const response = await axios.get(`https://tradestie.com/api/v1/apps/reddit`);
      setter(response.data.data);
      // console.log(data);
    }

    fetchWSB();
  },[]);
}

function App() {
  Unemployment();
  return (
    <div className="App h-screen grid grid-cols-3 grid-rows-3">
      <link href="/dist/output.css" rel="stylesheet"/>
      <div className="col-start-1 col-end-4 row-start-1 row-end-1 bg-red-200">Header</div>
      <div className="col-start-1 row-start-2 row-end-4 bg-blue-200">Sidebar</div>
      <div className="col-start-2 col-end-4 row-span-2 grid grid-cols-2">
        <div className="w-full h-full col-start-1">
          <Unemployment/>
        </div>
        <div className="w-full h-full col-start-2">
          <Unemployment/>
        </div>
        <div className="w-full h-full col-start-1 row-start-2">
          <Unemployment/>
        </div>
        <div className="w-full h-full col-start-2 row-start-2">
          <Unemployment/>
        </div>           
      </div>



    </div>

  );
}

export default App;
