import { render } from '@testing-library/react';
import './App.css';
import React, { useState, useEffect } from 'react';


function GetWoWCharacter() {
  const [character, setter] = useState(null);

  useEffect(() => {
  fetch("https://raider.io/api/v1/characters/profile?region=us&realm=Area%2052&name=ecckle")
  .then(response => response.json())
  .then(data => setter(data.thumbnail_url))
  },[])
  console.log(1);  
  return (
    <div>
       {character && <img src={character}></img>}
    </div>
  );
}


function App() {
  return (
    <div className="App">
      <link href="/dist/output.css" rel="stylesheet"/>
      <GetWoWCharacter/>
    </div>
  );
  }

export default App;
