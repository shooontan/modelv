import Document, { DocumentContext } from 'next/document';
import { resetIdCounter } from 'react-tabs';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    resetIdCounter();
    const initialProps = await Document.getInitialProps(ctx);
    return initialProps;
  }
}
