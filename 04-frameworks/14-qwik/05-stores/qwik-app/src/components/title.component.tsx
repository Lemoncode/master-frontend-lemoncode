interface TitleProps {
  display: boolean;
}

export const Title = ({ display }: TitleProps) => {
  return <>{display && <h1>Hi 🍋's this app it's going to be awesome</h1>}</>;
};
