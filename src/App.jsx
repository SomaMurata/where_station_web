import { useState, useEffect, useRef } from 'react';
import './App.scss';
import axios from 'axios';

function App() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [station, setStation] = useState('○△□駅');
  const [active, setActive] = useState('station_name');
  const [isAvailable, setAvailable] = useState(false);

  const isFirstRef = useRef(true);

  const stationURL =
    'http://express.heartrails.com/api/json?method=getStations';

  /*
   * ページ描画時にGeolocation APIが使えるかどうかをチェック
   * もし使えなければその旨のエラーメッセージを表示させます
   */
  const getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const getlatitude = position.coords.latitude;
      const getlongitude = position.coords.longitude;
      setLatitude(getlatitude);
      setLongitude(getlongitude);
    });
  };

  useEffect(() => {
    isFirstRef.current = false;
    if ('geolocation' in navigator) {
      setAvailable(true);
      getCurrentPosition();
    }
  }, [isAvailable]);

  // 緯度経度情報からAPIで駅を取得
  const getStation = async () => {
    try {
      const lat = latitude;
      const lon = longitude;
      const response = await axios.get(`${stationURL}&x=${lon}&y=${lat}`);
      const { data } = response;
      return data.response.station[0].name;
    } catch (error) {
      return 'エラー';
    }
  };

  // 現在地の駅を取得
  async function handlePress() {
    getCurrentPosition();
    setActive('station_name_active');
    const currentStation = await getStation();
    setStation(`${currentStation}駅`);
  }

  return (
    <div className="App">
      <div className="station">
        <p className="station_where">ココ何駅??</p>
        <div className={active}>
          <p>{station}</p>
        </div>
      </div>
      <button className="button_where" onClick={handlePress}>
        シラベル
      </button>
    </div>
  );
}

export default App;
