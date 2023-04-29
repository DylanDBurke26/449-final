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
        beginAtZero: true,
        color:'white',
      }
    },
    x: {
      ticks: {
        color:'white',
      }
    }
  },
  plugins: {
    title: {
      display: true,
      text: 'My Chart Title',
      color:'white'
    }
  }
};

function Crypto(args) {
  
  const [data, setter] = useState(null);
  const [arg, argSet] = useState(args.args[0]);

  
  const changeNumber = (number, timeFrame) => {
    argSet(number);
    // options.plugins.title.text = `${args.args[2]} ${timeFrame}`;

    console.log(args.args[3]);

    if (timeFrame === `weekly${args.args[3]}`) {
      document.getElementById(timeFrame).style.border = "solid white";
      document.getElementById(`monthly${args.args[3]}`).style.border = "none";
      document.getElementById(`ytd${args.args[3]}`).style.border = "none";
    }

    if (timeFrame === `monthly${args.args[3]}`) {
      document.getElementById(timeFrame).style.border = "solid white";
      document.getElementById(`weekly${args.args[3]}`).style.border = "none";
      document.getElementById(`ytd${args.args[3]}`).style.border = "none";
    }

    if (timeFrame === `ytd${args.args[3]}`) {
      document.getElementById(timeFrame).style.border = "solid white";
      document.getElementById(`weekly${args.args[3]}`).style.border = "none";
      document.getElementById(`monthly${args.args[3]}`).style.border = "none";
    }
  }

  useEffect(() => {
    async function fetchCryp() {
      
      const response = await axios.get(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=${args.args[2]}&tsym=USD&limit=${arg}`);
      setter(response.data.Data.Data);
    }

    fetchCryp();
  },[arg]);
    
  try {
    const times = data.map(t => (t.time));
    const closes = data.map(c => c.close);

    const d = {
      labels : times,
      datasets : [
        {
          label: 'Bitcoin',
          data: closes,
          fill : true,
          borderColor: 'rgba(75,192,1)',
          color: 'white',
        }
      ]
    };
    options.plugins.title.text = `${args.args[2]}`;
    // let opt = new options;
    // opt.plugins.title.text = `${args.args[2]} ${args.args[1]}`;
    return (
      <div>
        <div className="grid grid-cols-3">
          <button style={{border: 'solid  white'}} className="col-start-1" id={`weekly${args.args[3]}`} onClick={() => changeNumber(6, 'weekly')}>Weekly</button>
          <button className="col-start-2" id={`monthly${args.args[3]}`} onClick={() => changeNumber(29, 'monthly')}>Monthly</button>
          <button className="col-start-3" id={`ytd${args.args[3]}`} onClick={() => changeNumber(364, 'ytd')}>YTD</button>
        </div>
        <Line data={d} options={options}/>
      </div>
    );
  }
  catch(error) {}

}

function Exchange(args) {
  const [data, setter] = useState(null);

  useEffect(() => {
    async function fetchEx() {
      const response = await axios.get('https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json');
      setter(response.data);
    }

    fetchEx();
  },[]);

  try {
    // https://stackoverflow.com/questions/14014371/how-do-i-convert-a-string-into-an-executable-line-of-code-in-javascript/70896574#70896574
    // where i got the idea to use eval() to display the currency symbol
    const conversion = eval(args.args[0]);

    return (
      <div dangerouslySetInnerHTML={{__html: '$ to ' + args.args[1] + ': ' + conversion}}></div>
    );
  }
  catch(error) {}

}

function App() {
  return (
    <div className="App grid grid-cols-3 grid-rows-5 h-screen w-auto bg-gray-600 overflow-y-hidden">
      <link href="/dist/output.css" rel="stylesheet"/>
      {/* <div className="col-start-1 col-end-5 row-auto">Header</div> */}
      
      
      <div className="col-start-2  row-start-2 row-end-4 text-center justify-center items-center place-content-center border-r-2 mr-2">
        <h1 className="text-4xl font flex-none ml-2 sm:text-xs ">Curreny Exchange</h1>
        <ul className="grid grid-cols-1 grid-rows-2 gap-5 p-5 w-fit text-3xl sm:text-xs font-mono text-gray-100">
          <li className="border-2 border-green-900 col-start-1"><Exchange args={["data.usd.eur", "&euro;"]}/></li>
          <li className="border-2 border-green-900 col-start-1"><Exchange args={["data.usd.gbp", "&pound;"]}/></li>
          <li className="border-2 border-green-900 col-start-1"><Exchange args={["data.usd.jpy", "&yen;"]}/></li>
          <li className="border-2 border-green-900 col-start-1"><Exchange args={["data.usd.cny", "&#20803;"]}/></li>
          <li className="border-2 border-green-900 col-start-1"><Exchange args={["data.usd.rub", "&#8381;"]}/></li>
          <li className="border-2 border-green-900 col-start-1"><Exchange args={["data.usd.btc", "&#8383;"]}/></li>
        </ul>
      </div>
      


      <div className="col-start-1 row-start-2 text-gray-100 mb-10">
        <Crypto args={[6, 'Weekly', 'btc', 1]}/>
      </div>

      <div className="col-start-1 row-start-4 text-gray-100">
        <Crypto args={[6, 'Weekly', 'eth', 2]}/>
      </div>

      <div className="col-start-3 row-start-2 text-gray-100">
        <Crypto args={[6, 'Weekly', 'xrp', 3]}/>
      </div>

      <div className="col-start-3 row-start-4 text-gray-100">
        <Crypto args={[6, 'Weekly', 'ltc', 4]}/>
      </div>
      
    </div>

  );
}

export default App;