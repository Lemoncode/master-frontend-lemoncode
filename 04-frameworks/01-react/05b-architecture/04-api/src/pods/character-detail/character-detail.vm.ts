export interface Episode {
  id: number;
  code: string;
  title: string;
  airDate: string;
}

export interface CharacterDetail {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
  origin: string;
  location: string;
  episodeCount: number;
  episodes: Episode[];
}
