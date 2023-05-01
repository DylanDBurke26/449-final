import axios from 'axios';
import './App.css';
import React, { useState, useEffect} from 'react';

import {Line} from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';

// https://react-chartjs-2.js.org/faq/registered-scale/
Chart.register(CategoryScale);

// https://react-chartjs-2.js.org/examples/line-chart
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
      text: '',
      color:'white'
    }
  }
};

function Crypto(args) {
  
  const [data, setter] = useState(null);
  const [arg, argSet] = useState(args.args[0]);

  let newOptions = options;
  
  const changeNumber = (number, timeFrame) => {
    argSet(number);
    newOptions.plugins.title.text = `${args.args[2]} ${timeFrame}`;
  }

  // https://www.knowledgehut.com/blog/web-development/node-environment-variables
  // idea to get the api key at runtime 
  let key = process.env.REACT_APP_CRYPTO;

  useEffect(() => {
    async function fetchCryp() {
      
      const response = await axios.get(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=${args.args[2]}&tsym=USD&limit=${arg}&api_key=${key}`);
      setter(response.data.Data.Data);
    }

    fetchCryp();
  },[arg, newOptions]);
    
  try {
    const times = data.map(t => (t.time));
    const closes = data.map(c => c.close);

    // https://www.tutorialrepublic.com/faq/how-to-convert-a-unix-timestamp-to-time-in-javascript.php#:~:text=Answer%3A%20Use%20the%20new%20Date,%3A00%3A00%20UTC
    // used to convert unix time to date format
    for (let i = 0; i < times.length; i++) {
      times[i] = (new Date(times[i] * 1000)).toLocaleDateString("en-US");
    }

    // https://react-chartjs-2.js.org/examples/line-chart
    const d = {
      labels : times,
      datasets : [
        {
          label: args.args[2],
          data: closes,
          fill : true,
          borderColor: 'rgb(75,192,1)',
          color: 'white',
        }
      ]
    };
    return (
      <div>
        <div className="grid grid-cols-3">
          <button className="col-start-1 hover:text-green-600" id={`weekly${args.args[3]}`} onClick={() => changeNumber(6, 'weekly')}>Weekly</button>
          <button className="col-start-2 hover:text-green-600" id={`monthly${args.args[3]}`} onClick={() => changeNumber(29, 'monthly')}>Monthly</button>
          <button className="col-start-3 hover:text-green-600" id={`ytd${args.args[3]}`} onClick={() => changeNumber(364, 'ytd')}>YTD</button>
        </div>
        <Line data={d} options={newOptions}/>
      </div>
    );
  }
  catch(error) {}

}

function Exchange(args) {
  const [data, setter] = useState(null);

  useEffect(() => {
    async function fetchEx() {
      const response = await axios.get(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${args.args[0]}.json`);
      setter(response.data);
    }

    fetchEx();
  },[]);

  try {
    const conversion = data[args.args[0]]['usd'];
    
    return (
      <div dangerouslySetInnerHTML={{__html: args.args[1] +  ' -> $' + conversion}}></div>
    );
  }
  catch(error) {}

}

function App() {
  return (
    <div className="App flex flex-col h-screen w-auto bg-gray-600 md:h-max">
      <link href="/dist/output.css" rel="stylesheet"/>
      
      <div className="basis-1/6 text-center bg-gray-900 grid grid-cols-4 grid-rows-2 text-gray-100 text-3xl justify-center align-middle items-center h-1/4 sm:text-sm">
        <h1 className="text-6xl font ml-2 text-gray-100 col-start-2 col-end-4 row-start-1 sm:text-sm">Crypto Exchange as of {(new Date().toISOString().substring(0,10))}</h1>
        <div className=" col-start-1 row-start-2"><Exchange args={["btc", "BTC"]}/></div>
        <div className=" col-start-2 row-start-2"><Exchange args={["eth", "ETH"]}/></div>
        <div className=" col-start-3 row-start-2"><Exchange args={["ltc", "LTC"]}/></div>
        <div className=" col-start-4 row-start-2"><Exchange args={["xrp", "XRP"]}/></div>
      </div>
      

      <div className="grow basis-3/4 flex flex-wrap justify-center">
        <div className="basis-1/3 text-gray-100">
          <h1 className="text-4xl">Bitcoin</h1>
          <Crypto args={[6, 'Weekly', 'btc', 1]}/>
        </div>

        <div className="basis-1/3 text-gray-100">
          <h1 className="text-4xl">Ethereum</h1>
          <Crypto args={[6, 'Weekly', 'eth', 2]}/>
        </div>

        <div className="basis-1/3 text-gray-100">
          <h1 className="text-4xl">LiteCoin</h1>
          <Crypto args={[6, 'Weekly', 'ltc', 4]}/>
        </div>

        <div className="basis-1/3 text-gray-100">
          <h1 className="text-4xl">XRP</h1>
          <Crypto args={[6, 'Weekly', 'xrp', 3]}/>
        </div>
      </div>
      
      
    </div>

  );
}

export default App;