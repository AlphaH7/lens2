import { useEffect, useReducer, useState } from 'react';

import Lens from '@/components/Lens';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import client from '@/utils/AppHelper';

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

function reducer(state: State, action: Action) {
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
  const [isLoading, dispatch] = useReducer(reducer, false);
  const [results, setResults] = useState<IData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'fetching' });
      try {
        const response = await client.get('/api/users');
        console.log(response.data);
        setResults(response.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        dispatch({ type: 'fetched' });
      }
    };

    fetchData();
  }, []);

  const renderHighlightedField = (str: string, key: string, input: string) => {
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

  const listElementRenderer = (data: IData, input: string) => (
    <>
      <p className="text-sm text-white">
        {renderHighlightedField(data.id, JSON.stringify(data), input)}
      </p>
      <li className="my-1 border-y border-white py-1 text-sm text-white">
        {renderHighlightedField(
          `${data.name} bought - ${data.items.join(', ')}`,
          JSON.stringify(data),
          input
        )}
      </li>
      <p className="text-sm text-white">
        {renderHighlightedField(
          `${data.address}, ${data.pincode}`,
          JSON.stringify(data),
          input
        )}
      </p>
    </>
  );

  return (
    <Main
      meta={
        <Meta
          title={`${AppConfig.title} - ${AppConfig.description}`}
          description={AppConfig.description}
        />
      }
    >
      <div className="flex h-full w-full flex-col items-center justify-center pb-20">
        <h1 className="web-head text-[70px] text-white">{AppConfig.title}</h1>
        <h2 className="text-white">{AppConfig.description}</h2>
        {!isLoading ? (
          <Lens
            listData={results}
            onOptionSelect={(optn: any) => {
              console.log(optn);
            }}
            hoverStyles="bg-white bg-opacity-30"
            listElementStyles="w-full cursor-pointer px-2 py-3 text-left"
            listElementRenderer={listElementRenderer}
            listCtrStyle="absolute top-full z-10 mt-2 h-64 w-[400px] overflow-auto rounded-lg border-2 border-white bg-white bg-opacity-10 shadow-lg transition-all"
          />
        ) : null}
      </div>
    </Main>
  );
};

export default Index;
