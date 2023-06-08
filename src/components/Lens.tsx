import React, { useEffect, useRef, useState } from 'react';

interface IData {
  address: string;
  id: string;
  items: string[];
  name: string;
  pincode: string;
  [key: string]: any;
}

interface LensProps {
  onOptionSelect: (data: IData) => void;
  listData: Array<IData>;
  listElementStyles?: string;
  hoverStyles?: string;
  listElementRenderer: (data: IData, input: string) => JSX.Element;
  listCtrStyle?: string;
  emptyViewRenderer: (input: string) => JSX.Element;
  inputStyles: string;
}

const Lens: React.FC<LensProps> = (props) => {
  const [inputString, setInputString] = useState<string>('');
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);
  const resultRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const {
    listData,
    onOptionSelect,
    listElementStyles = '',
    hoverStyles = '',
    listElementRenderer,
    listCtrStyle = '',
    emptyViewRenderer,
    inputStyles = '',
  } = props;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputString(event.target.value);
  };

  const returnFileredResults = () => {
    return inputString.length === 0
      ? []
      : listData.filter((data) => {
          return Object.keys(data).some((key) => {
            const value = data[key];
            if (Array.isArray(value)) {
              return value.some((v) =>
                String(v).toLowerCase().includes(inputString.toLowerCase())
              );
            }
            return String(value)
              .toLowerCase()
              .includes(inputString.toLowerCase());
          });
        });
  };

  const onKeyPressed = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const filteredResults = returnFileredResults();
    const totalResults = filteredResults.length;

    if (event.key === 'ArrowDown' && hoveredIndex < totalResults - 1) {
      setHoveredIndex((prevHoveredIndex) => prevHoveredIndex + 1);
    } else if (event.key === 'ArrowUp' && hoveredIndex > 0) {
      setHoveredIndex((prevHoveredIndex) => prevHoveredIndex - 1);
    } else if (event.key === 'Enter') {
      const selectedData = filteredResults[hoveredIndex];
      if (selectedData) {
        onOptionSelect(selectedData);
      }
    }
  };

  const setHoveredItem = (index: number) => {
    setHoveredIndex(index);
  };

  useEffect(() => {
    resultRefs.current[hoveredIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [hoveredIndex]);

  const filteredResults = returnFileredResults();

  useEffect(() => {
    resultRefs.current = resultRefs.current.slice(0, filteredResults.length);
  }, [filteredResults]);

  return (
    <div className="relative flex w-full items-center justify-center">
      <input
        type="text"
        value={inputString}
        onChange={handleChange}
        onKeyDown={onKeyPressed}
        className={inputStyles}
        placeholder="Search users by ID, name, address"
      />

      {inputString.length > 0 && (
        <div className={`lens-list-ctr ${listCtrStyle}`}>
          {filteredResults.length === 0
            ? emptyViewRenderer(inputString)
            : filteredResults.map((data, i) => (
                <button
                  key={data.id}
                  className={`${listElementStyles} lens-list-elem-ctr ${
                    i === hoveredIndex ? hoverStyles : ''
                  }`}
                  type="button"
                  onClick={() => onOptionSelect(data)}
                  onMouseEnter={() => setHoveredItem(i)}
                  ref={(el) => {
                    resultRefs.current[i] = el;
                  }}
                >
                  {listElementRenderer(data, inputString)}
                </button>
              ))}
        </div>
      )}
    </div>
  );
};

export default Lens;
