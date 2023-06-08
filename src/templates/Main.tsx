import type { ReactNode } from 'react';

import { AppConfig } from '@/utils/AppConfig';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <div className="h-full min-h-full w-full px-1 text-gray-700 antialiased">
    {props.meta}

    <div className="relative mx-auto h-full max-h-full w-full max-w-screen-md overflow-hidden">
      <header className="" />

      <main className="content h-full text-xl">{props.children}</main>

      <footer className="fixed bottom-0 w-full max-w-screen-md  py-2 text-center text-sm">
        © Copyright {new Date().getFullYear()} {AppConfig.title}. Made by{' '}
        <a href="https://www.alistier.dev">Alistier X.</a>.
        {/*
         * PLEASE READ THIS SECTION
         * I'm an indie maker with limited resources and funds, I'll really appreciate if you could have a link to my website.
         * The link doesn't need to appear on every pages, one link on one page is enough.
         * For example, in the `About` page. Thank you for your support, it'll mean a lot to me.
         */}
      </footer>
    </div>
  </div>
);

export { Main };
