import { useEffect, useReducer, useState } from 'react';

import Lens from '@/components/Lens';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import client from '@/utils/AppHelper';

type State = boolean;
type Action = { type: 'fetching' } | { type: 'fetched' };

interface IData {
  id: string;
  name: string;
  address: string;
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
          />
        ) : null}
      </div>
    </Main>
  );
};

export default Index;
