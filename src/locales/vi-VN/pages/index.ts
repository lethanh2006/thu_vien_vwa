import danhmuc from './danhmuc';
import login from './login';
import sachtailieu from './sachtailieu';

export default {
	...login,
	...danhmuc,
	...sachtailieu,

	'pages.trangchu.title': 'PHÂN HỆ THƯ VIỆN',
	'pages.trangchu.subtitle': 'HỆ THỐNG CHUYỂN ĐỔI SỐ',
	'pages.gioithieu.title': 'GIỚI THIỆU',
	'pages.gioithieu.subtitle': 'HỆ THỐNG CHUYỂN ĐỔI SỐ',
};
