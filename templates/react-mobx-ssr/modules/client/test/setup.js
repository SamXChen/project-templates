import 'raf/polyfill'
import 'jsdom-global/register'
require('jsdom-global')()

import enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
enzyme.configure({ adapter: new Adapter() })

global.enzyme = enzyme
global.shallow = enzyme.shallow
global.render = enzyme.render
global.mount = enzyme.mount
global.DOMParser = window.DOMParser
