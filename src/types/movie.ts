export type Movie = {
  id: number;
  title: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  release_date?: string;
  genre_ids?: number[];
};

export type Genre = {
  id: number;
  name: string;
};
