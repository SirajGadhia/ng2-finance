import { Map } from 'immutable';

export interface CoreApiStateInterface extends Map<string,any> {
  data?:any[];
  loader?:boolean;
  error?:string;
}

export class CoreApiStateKeys {
  static Data = 'data';
  static Loader = 'loader';
  static Error = 'error';
}
