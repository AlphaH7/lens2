/* eslint-disable react/no-array-index-key */
import { useRouter } from 'next/router';
import { useEffect, useReducer, useState } from 'react';

import Lens from '@/components/Lens';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import apiHelper from '@/utils/ApiHelper';
import { AppConfig } from '@/utils/AppConfig';

type State = boolean;
type Action = { type: 'fetching' } | { type: 'fetched' };

interface IData {
  address: string;
  id: string;
  items: string[];
  name: string;
  pincode: string;
  [key: string]: any;
}

function loadingReducer(state: State, action: Action) {
  switch (action.type) {
    case 'fetching':
      return true;
    case 'fetched':
      return false;
    default:
      return state;
  }
}

const Index = () => {
  const [isLoading, dispatch] = useReducer(loadingReducer, false);
  const [results, setResults] = useState<IData[]>([]);
  const [selectedOption, setSelectedOption] = useState<IData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'fetching' });
      try {
        const response = await apiHelper.getUsers();
        setResults(response.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        dispatch({ type: 'fetched' });
      }
    };

    fetchData();
  }, []);

  const clearSelected = () => {
    setSelectedOption(null);
  };

  const renderHighlightedField = (str: string, input: string) => {
    const strTemp = str.replace(new RegExp(input, 'gi'), `+-+${input}+-+`);
    const strArr = strTemp.split('+-+');
    return strArr.map((data: string, i: number) =>
      input === data ? (
        <span className="text-orange-600" key={str + data + i}>
          {input}
        </span>
      ) : (
        data
      )
    );
  };

  const listElementRenderer = (data: IData, input: string) => (
    <>
      <p className="text-sm text-white">
        {renderHighlightedField(data.id, input)}
      </p>
      <li className="my-1 border-y border-white py-1 text-sm text-white">
        {renderHighlightedField(
          `${data.name} bought - ${data.items.join(', ')}`,
          input
        )}
      </li>
      <p className="text-sm text-white">
        {renderHighlightedField(`${data.address}, ${data.pincode}`, input)}
      </p>
    </>
  );

  const emptyViewRenderer = () => {
    return (
      <div className="flex h-full w-full items-center justify-center px-4 py-3">
        <p className="text-gray-500">No Users Found</p>
      </div>
    );
  };

  return (
    <Main
      meta={
        <Meta
          title={`${AppConfig.title} - ${AppConfig.description}`}
          description={AppConfig.description}
        />
      }
    >
      <div className="flex h-full w-full flex-col items-center justify-start pt-44  md:justify-center md:pt-0 ">
        <h1 className="web-head text-[70px] text-white">{AppConfig.title}</h1>
        <h2 className="text-sm  text-white md:text-lg">
          {AppConfig.description}
        </h2>
        {isLoading && (
          <img
            src={`${router.basePath}/assets/images/bars.svg`}
            className="my-5 h-12"
            alt="Nextjs starter banner"
          />
        )}
        {!isLoading && selectedOption && (
          <>
            <button
              onClick={clearSelected}
              type="button"
              className="pt-5 text-sm text-white"
            >
              ⬅ Go Back
            </button>
            <div className="lens-list-elem-ctr mt-5 w-[400px] max-w-[90%] rounded-lg border-2 border-white p-3">
              {listElementRenderer(selectedOption, '')}
            </div>
          </>
        )}
        {!isLoading && !selectedOption && (
          <Lens
            listData={results}
            onOptionSelect={(optn: any) => {
              setSelectedOption(optn);
            }}
            hoverStyles="bg-white bg-opacity-30"
            listElementStyles="w-full cursor-pointer px-2 py-5 text-left border-white border-b"
            listElementRenderer={listElementRenderer}
            listCtrStyle="max-w-[90%] absolute top-full z-10 mt-2 h-80 max-h-[50vh] md:max-h-[30vh] w-[400px] overflow-auto rounded-lg border-2 border-white bg-white bg-opacity-10 shadow-lg transition-all"
            emptyViewRenderer={emptyViewRenderer}
            inputStyles="max-w-[90%] h-12 border-white-2 my-5 w-[400px] appearance-none rounded-lg border bg-transparent px-3 py-2 leading-tight text-white shadow transition-all placeholder:font-medium placeholder:text-gray-100 focus:outline-none focus:placeholder:text-gray-500"
            placeholderText="Search users by ID, name, address"
          />
        )}
      </div>
    </Main>
  );
};

export default Index;
