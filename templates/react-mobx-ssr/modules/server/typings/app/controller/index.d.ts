// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportApi from '../../../app/controller/api';
import ExportHome from '../../../app/controller/home';

declare module 'egg' {
  interface IController {
    api: ExportApi;
    home: ExportHome;
  }
}
