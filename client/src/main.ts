import './style.css';
import { GoogleLoader } from './modules/GoogleLoader';
import { Maps } from './hospitalClass/Maps';

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <h1>Hello EyeSite!</h1>
`;

/**  div id = mapをhtmlから取得 */
export const divMap = document.querySelector<HTMLDivElement>('#map');

export const hos_data = document.querySelector<HTMLDivElement>('#hos_data');

GoogleLoader.load().then(async () => {
  /** 位置情報をもとに座標を取得 */
  const result = await new Maps().getLatLng();
  /** 地図表示＆病院検索 */
  await GoogleLoader.load().then(() => {
    new Maps().initMap(result);
  });
});
