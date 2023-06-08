import React, { useEffect, useRef, useState } from 'react';

interface IData {
  id: string;
  name: string;
  address: string;
  [key: string]: any;
}

interface LensProps {
  onOptionSelect: (data: IData) => void;
  listData: Array<IData>;
}

const Lens: React.FC<LensProps> = (props) => {
  const [inputString, setInputString] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const resultRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { listData, onOptionSelect } = props;
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

  const renderHighlightedField = (str: string, key: string) => {
    const input = inputString;
    const strTemp = str.replace(new RegExp(input, 'gi'), `+-+${input}+-+`);
    const strArr = strTemp.split('+-+');
    return strArr.map((data) =>
      input === data ? (
        <span className="text-orange-600" key={str + key}>
          {input}
        </span>
      ) : (
        data
      )
    );
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
        className="h-15 border-white-2 my-5 w-[400px] appearance-none rounded-lg border bg-transparent px-3 py-2 leading-tight text-white shadow transition-all placeholder:font-medium placeholder:text-gray-100 focus:outline-none focus:placeholder:text-gray-500"
        placeholder="Search users by ID, name or address"
      />

      {inputString.length > 0 && (
        <div className="absolute top-full z-10 mt-2 h-64 w-[400px] overflow-auto rounded-lg border-2 border-white bg-white bg-opacity-10 shadow-lg transition-all">
          {filteredResults.length === 0 ? (
            <div className="px-4 py-3">
              {/* <EmbaressedIcon /> */}
              <p className="text-gray-500">No Users Found</p>
            </div>
          ) : (
            filteredResults.map((data, i) => (
              <button
                key={data.id}
                className={`w-full cursor-pointer px-2 py-3 text-left ${
                  i === hoveredIndex ? 'bg-white bg-opacity-30' : ''
                }`}
                type="button"
                onClick={() => onOptionSelect(data)}
                onMouseEnter={() => setHoveredItem(i)}
                ref={(el) => {
                  resultRefs.current[i] = el;
                }}
              >
                <p className="text-sm text-white">
                  {renderHighlightedField(data.id, JSON.stringify(data))}
                </p>
                <li className="my-1 border-y border-white py-1 text-sm text-white">
                  {renderHighlightedField(data.name, JSON.stringify(data))}
                </li>
                <p className="text-sm text-white">
                  {renderHighlightedField(data.address, JSON.stringify(data))}
                </p>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Lens;
