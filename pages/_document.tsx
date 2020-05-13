import React from 'react';
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentProps,
} from 'next/document';
import { resetIdCounter } from 'react-tabs';
import { store } from '@/store';
import { RootState } from '@/modules';

type Props = DocumentProps & {
  initialState: RootState;
};

export default class MyDocument extends Document<Props> {
  static async getInitialProps(ctx: DocumentContext) {
    resetIdCounter();
    const initialProps = await Document.getInitialProps(ctx);
    const initialState = store.getState();
    return {
      ...initialProps,
      initialState,
    };
  }

  render() {
    return (
      <Html lang="ja">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
