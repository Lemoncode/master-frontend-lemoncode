export interface SinglePost {
  id: string;
  title: string;
  date: string;
  summary: string;
  author: string;
  content: string;
  image: {
    name: string;
    link: string;
  };
}
