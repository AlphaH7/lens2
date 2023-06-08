import { useEffect } from 'react';

import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import client from '@/utils/AppHelper';

const Index = () => {
  useEffect(() => {
    console.log('client rendered');
    client
      .get('/api/users')
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
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
      <div />
    </Main>
  );
};

export default Index;
