import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {
  Config,
  CoreApiResponseService,
  numberUnitFormat
} from '../../../core/index';
import {
  InfoStateService,
  InfoDataInterface
} from './state/index';
import { RangeOptionsInterface } from './range/range.component';
declare let moment:any;
declare let _:any;

@Injectable()
export class InfoApiService extends CoreApiResponseService {
  private stock:string;

  constructor(public http:Http,
              private infoState:InfoStateService) {
    super(http, infoState);
  }

  load(stock:string) {
    this.stock = stock;
    this.infoState.fetchLoader(true);
    this.get(Config.paths.info.replace('$stock', encodeURIComponent(stock)))
      .subscribe(
        data => this.complete(this.transform(data)),
        () => this.failed()
      );
  }

  reload() {
    this.load(this.stock);
  }

  getDataWithUpdatedPrice(data:InfoDataInterface, price:number):InfoDataInterface {
    let newData:InfoDataInterface = Object.assign({}, data);
    newData.DaysLow = Math.min(data.DaysLow, price);
    newData.DaysHigh = Math.max(data.DaysHigh, price);
    newData.YearLow = Math.min(data.YearLow, price);
    newData.YearHigh = Math.max(data.YearHigh, price);

    return newData;
  }

  getDayOptions(data:InfoDataInterface, price:number):RangeOptionsInterface {
    return {
      text: 'Day\'s Range',
      start: data.DaysLow,
      end: data.DaysHigh,
      activeStart: Math.min(data.Open, price),
      activeEnd: Math.max(data.Open, price),
      active: price
    };
  }

  getYearOptions(data:InfoDataInterface, price:number):RangeOptionsInterface {
    return {
      text: '52 Week Range',
      start: data.YearLow,
      end: data.YearHigh,
      activeStart: Math.min(data.Open, price),
      activeEnd: Math.max(data.Open, price),
      active: price
    };
  }

  private transform(rawData:any):InfoDataInterface[] {
    let data:InfoDataInterface[] = [];
    let info:any = _.get(rawData, 'query.results.quote');
    if (info) {
      info.Volume = numberUnitFormat(info.Volume, 2);
      info.AverageDailyVolume = numberUnitFormat(info.AverageDailyVolume, 2);
      data.push(info);
    }

    return data;
  }

  private convertDate(date:number):string {
    return moment(date * 1000).format('ddd, MMM Do YYYY h:mm A');
  }
}
