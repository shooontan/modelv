interface Window {
  cv: OpenCVJS;
}

declare namespace NodeJS {
  interface ProcessEnv {
    APP_URL: string;
    APP_TITLE: string;
    APP_DESCRIPTION: string;
  }
}
