// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportApi from '../../../app/service/api';

declare module 'egg' {
  interface IService {
    api: ExportApi;
  }
}
