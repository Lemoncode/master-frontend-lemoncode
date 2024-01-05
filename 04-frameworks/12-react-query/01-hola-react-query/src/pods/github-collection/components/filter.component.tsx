import React from "react";

interface Props {
  initialValue: string;
  onSearch: (value: string) => void;
}

export const FilterComponent: React.FC<Props> = (props) => {
  const { initialValue, onSearch } = props;
  const [value, setValue] = React.useState(initialValue);

  return (
    <>
      <div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          onClick={() => {
            onSearch(value);
          }}
        >
          Buscar
        </button>
      </div>
    </>
  );
};
