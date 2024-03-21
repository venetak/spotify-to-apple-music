import './App.css';
import { useState, useEffect } from 'react';
import { awaitTo } from './helpers/awaitTo';
import axios from 'axios';

const params = new URLSearchParams();
params.append('grant_type', 'client_credentials');
params.append('client_id', 'dff6c2f4f7804bedb05eaf9b42a3b2e3');
params.append('client_secret', 'bd09b93fd6304fbbb445421c1d4d274f');

type Track = {
  track: {
    album: {name: string},
    name: string,
    artists: [{name:string}]
  }
}

type TracksList = Track[];

function App() {
  let token = '';
  const [tracks, setTracks] = useState<TracksList>([{
    "track": {
      "album": {
          "name": "The Man Who Invented Soul"
      },
      "artists": [
          {
              "name": "Sam Cooke"
          }
      ],
      "name": "(What A) Wonderful World"
  }
  }]);

  const getToken = async () => {
    const [error, response] = await awaitTo(axios.post('https://accounts.spotify.com/api/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }));
    return response.data.access_token;
  }

  useEffect(() => {
    axios.post('https://accounts.spotify.com/api/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(data => {
      getAllTracks(data.data.access_token).then(response => {
        console.log(response)
      }).catch(console.error);
    })
  }, [params]);


  const getTracks = async (offset: number, token: string, limit: number = 50) => {
    const [error, response] = 
      await awaitTo(axios.get(`https://api.spotify.com/v1/playlists/11eTwYO8Wk0OyGkCl1eubL/tracks?fields=total,items(track(name,album(name),artists(name)))&limit=${limit}&offset=${offset}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }));

    return response;
  }

  const getAllTracks = async (token: string) => {

    let [e, allTracksData] = await awaitTo(axios.get('https://api.spotify.com/v1/playlists/11eTwYO8Wk0OyGkCl1eubL/tracks?fields=total', {
      headers: { 'Authorization': `Bearer ${token}` }
    }));

    let allTracks = allTracksData.data.total;

    let offset = 0;
    let tracksData;

    let tracksTmp: Track[] = [];

    while (allTracks !== 0 || allTracks !< 0) {
        const [errGettingTracks, response] = await awaitTo(getTracks(offset, token));
        tracksTmp = [...tracksTmp, ...response.data.items];

        allTracks -= 50;
    }

    setTracks(tracksTmp);
  }

  const listItems = tracks.map((item, idx) =>
    <li key={idx}>
      <span>{item.track.artists[0].name}</span> - <span>{item.track.name}</span>
    </li>
  );
  return (
    <div className="App">

    
     <ol>{listItems}</ol>;
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
