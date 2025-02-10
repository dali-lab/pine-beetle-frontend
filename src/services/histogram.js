import axios from 'axios';

const SUBROUTE = 'histogram';

const getHistogram = async () => {
  const url = `${global.API_URL}/${SUBROUTE}/`;

  try {
    const { data: response } = await axios.get(url);

    const { data } = response;

    return { frequencyArray: data.frequencyArray, frequency: data.frequency };
  } catch (error) {
    console.error(error); throw error;
  }
};

export default getHistogram;
