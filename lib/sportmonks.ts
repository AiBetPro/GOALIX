const API_KEY = process.env.SPORTMONKS_API_KEY;
const BASE_URL = 'https://api.sportmonks.com/v3';

export async function getMatches(sportId: number) {
  try {
    const response = await fetch(`${BASE_URL}/matches?filter[sport_id]=${sportId}&api_token=${API_KEY}`);
    return response.json();
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
}

export async function getMatch(matchId: number) {
  try {
    const response = await fetch(`${BASE_URL}/matches/${matchId}?api_token=${API_KEY}`);
    return response.json();
  } catch (error) {
    console.error('Error fetching match:', error);
    throw error;
  }
}

export async function getTeams(sportId: number) {
  try {
    const response = await fetch(`${BASE_URL}/teams?filter[sport_id]=${sportId}&api_token=${API_KEY}`);
    return response.json();
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
}
