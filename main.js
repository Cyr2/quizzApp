import { fetchData } from './useFetch';

fetchData().then(data => {
  console.log(data);
});