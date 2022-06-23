import logo from './logo.svg';
import axios from 'axios';
import React, {useState} from 'react';

function App() {
  const[address, setAddress] = useState("");
  const[blockchain, setBlockchain] = useState("");
  const[tokenInfo, setTokenInfo] = useState([]);
  const headers = {
    'x-api-key' : 'UEj11ZAfu7nJk0ZztnIvbLAdW8KFauDDalWF64XN1UfoHhcuLj6auyJl6nuXXXXX'
  }

  function getTokenBalances(e) {
    e.preventDefault();
    console.log("Fetching all user held token information");
    console.log(address);
    let config = {
        headers: headers,
        params: {
          chain: blockchain
        },
    }
    axios.get('https://deep-index.moralis.io/api/v2/'+ address +'/erc20',config
    ).then((response) => {
      return response.data;
    }).then((tokens) => {
      console.log("Fetching current user token prices in usd");
      let tokenInfo = [];
      tokens.forEach((item)=> {
        let obj = {};
        obj['id'] = item.token_address;
        obj['name'] = item.name;
        obj['symbol'] = item.symbol;
        obj['balanceTokens'] = item.balance / (10 ** item.decimals);
        axios.get('https://deep-index.moralis.io/api/v2/erc20/' + item.token_address + "/price",
        {headers}
      ).then((response) => {
        let data = response.data;
        obj['priceInUsd'] = data.usdPrice;
        //tokenInfo.push(obj);
      }).catch(error => {
        obj['priceInUsd'] =`${error.response.data.message}`;
      }).finally(()=>{
        tokenInfo.push(obj);
      })
    })
      console.log(tokenInfo);
    }).catch(error => {
      console.log(error);
  })
}

  return (
    <div className="App" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
      <form onSubmit={(e) => getTokenBalances(e)}>
      <label><h3>Enter your wallet address:</h3></label>
      <input onChange={e => setAddress(e.target.value)} id="address" value={address} placeholder="address" type="text" /><br/><br/>
      <input onChange={e => setBlockchain(e.target.value)} id="blockchain" value={blockchain} placeholder="blockchain" type="text" /><br/><br/>
      <button>Get Tokens</button>
      </form>
    </div>
  );
}

export default App;
