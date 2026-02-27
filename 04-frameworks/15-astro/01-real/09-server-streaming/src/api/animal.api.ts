export async function getRandomDogImage(): Promise<string> {
  const imageError =
    "https://www.publicdomainpictures.net/pictures/190000/nahled/sad-dog-1468499671wYW.jpg";

  const res = await fetch("https://dog.ceo/api/breeds/image/random");
  const response: { message?: string } = await res.json();
  return response?.message ?? imageError;
}

export async function getRandomCatImage(): Promise<string> {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const data: { url: string }[] = await res.json();

  await new Promise((resolve) => setTimeout(resolve, 5000));

  return data[0].url;
}
