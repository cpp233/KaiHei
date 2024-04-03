declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DEFAULT_CHANNEL: string;
      // 继续在这里添加更多的环境变量
    }
  }
}

// 如果这个文件有导出的模块，那么需要将上述代码包裹在模块声明中，如下：
declare module NodeJS {
  export interface ProcessEnv {
    DEFAULT_CHANNEL: string;
    WS_URL_IO: string;
    WS_URL_MESSAGE: string;
    WS_URL_DIRECT_MESSAGE: string;
    // 您可以继续在这里添加更多的环境变量
  }
}
