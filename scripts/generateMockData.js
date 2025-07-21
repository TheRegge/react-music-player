import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const JAMENDO_API_URL = 'https://api.jamendo.com/v3.0';
const CLIENT_ID = process.env.VITE_JAMENDO_CLIENT_ID;

if (!CLIENT_ID) {
  console.error('Error: VITE_JAMENDO_CLIENT_ID not found in .env file');
  process.exit(1);
}

// Mood configurations from the app - matching the actual app moods
const moods = [
  { id: 'rock', name: 'Rock', tags: ['rock', 'hardrock', 'indierock', 'alternative'] },
  { id: 'funk', name: 'Funk', tags: ['funk', 'soul', 'jazz', 'blues'] },
  { id: 'pop', name: 'Pop', tags: ['pop', 'dance', 'electronic', 'synthpop'] }
];

async function fetchTracksByMood(mood, limit = 10) {
  const tagsQuery = mood.tags.join('+');
  const url = `${JAMENDO_API_URL}/tracks/?client_id=${CLIENT_ID}&format=jsonpretty&limit=${limit}&fuzzytags=${tagsQuery}&order=popularity_total`;
  
  try {
    console.log(`Fetching ${mood.name} tracks...`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching ${mood.name} tracks:`, error);
    return [];
  }
}

async function generateMockData() {
  console.log('Generating mock data from Jamendo API...\n');
  
  const mockData = {
    generated: new Date().toISOString(),
    moods: {}
  };
  
  // Fetch tracks for each mood
  for (const mood of moods) {
    const tracks = await fetchTracksByMood(mood, 10);
    mockData.moods[mood.id] = {
      mood: mood,
      tracks: tracks
    };
    console.log(`✓ Fetched ${tracks.length} tracks for ${mood.name}`);
  }
  
  // Save to file
  const outputPath = join(__dirname, '..', 'src', 'services', 'mockData.json');
  await fs.writeFile(
    outputPath,
    JSON.stringify(mockData, null, 2),
    'utf-8'
  );
  
  console.log(`\n✓ Mock data saved to: ${outputPath}`);
  console.log(`✓ Total tracks saved: ${Object.values(mockData.moods).reduce((sum, m) => sum + m.tracks.length, 0)}`);
}

generateMockData().catch(console.error);