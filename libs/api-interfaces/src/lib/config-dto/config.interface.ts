export interface ConfigInterface {
  name: string;
  
  url: string;
  
  cron: string;
  
  config: object;
}

export interface ConfigResponseInterface extends ConfigInterface {
  _id: string;
  
  updatedAt: string;
  
  createdAt: string;
}

export interface ConfigRequestInterface extends ConfigInterface {
}