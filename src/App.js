import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import spotifylogo from './assets/spotify-icon.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = 'sakshamm_9';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

//Test Gifs
const TEST_GIFS = [
	'https://open.spotify.com/embed/track/2Gd7x92yhLBkK29XenAjjX?si=5e8e22fc628548ac',
	'https://open.spotify.com/embed/track/3uouaAVXpQR3X8RYkJyitQ',
  'https://open.spotify.com/embed/track/6N22FZs2ZhPBYi3b9XPajV', 'https://open.spotify.com/embed/track/4iJyoBOLtHqaGxP12qzhQI'
  

]

const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);
  
  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const sendGif = async () => {
    if (inputValue.length > 10) {
      console.log('Gif link:', inputValue);
      setGifList([...gifList, inputValue]);
      setInputValue('');
    } else {
      console.log('Empty input. Try again.');
    }
  };

  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );

          /*
           * Set the user's publicKey in state to be used later!
           */
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  /*
   * Let's define this method so our code doesn't break.
   * We will write the logic for this next!
   */
  const connectWallet = async () => {  const { solana } = window;
  
  

  if (solana) {
    const response = await solana.connect();
    console.log('Connected with Public Key connectwallet:', response.publicKey.toString());
    setWalletAddress(response.publicKey.toString());
  }};

  /*
   * We want to render this UI when the user hasn't connected
   * their wallet to our app yet.
   */
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
    
  );

  const renderConnectedContainer = () => (
    <div className="connected-container">
      {/* Go ahead and add this input and button to start */}
      <form
       onSubmit={(event) => {
       event.preventDefault();
        sendGif();
      }}
      >
      <input
       type="text"
       placeholder="Enter Song/Playlist linkyy!"
       value={ inputValue }
       onChange={ onInputChange }
      />
       <button type="submit" className="cta-button submit-gif-button">
         Submit
       </button>
      </form>
      <div className="gif-grid">
        {gifList.map(gif => (
          <div className="gif-item" key={gif}>
          <iframe scrolling="yes" src={gif} width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
          </div>
        ))}
      </div>
    </div>
  );

    // UseEffects
    useEffect(() => {
      const onLoad = async () => {
        await checkIfWalletIsConnected();
      };
      window.addEventListener('load', onLoad);
      return () => window.removeEventListener('load', onLoad);
    }, []);
    useEffect(() => {
      if (walletAddress) {
        console.log('Fetching GIF list...');
        
        // Call Solana program here.
    
        // Set state
        setGifList(TEST_GIFS);
      }
    }, [walletAddress]);
  
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header"> 
          <img alt="Spotify Logo" className="spotify-logo" src={spotifylogo} /> 
           Playlist-ify</p>
          <p className="sub-text">
            View your Spotify collection in the metaverse ✨
          </p>
          {/* Render your connect to wallet button right here */}
          {!walletAddress && renderNotConnectedContainer()}
          {/* We just need to add the inverse here! */}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
