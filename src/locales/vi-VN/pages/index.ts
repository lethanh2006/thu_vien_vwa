import danhmuc from './danhmuc';
import daotao from './daotao';
import login from './login';
import luananluanvankhoaluan from './luananluanvankhoaluan';
import sachtailieu from './sachtailieu';
import vaorathuvien from './vaorathuvien';

export default {
	...login,
	...danhmuc,
	...sachtailieu,
	...vaorathuvien,
	...luananluanvankhoaluan,
	...daotao,

	'pages.trangchu.title': 'PHÂN HỆ THƯ VIỆN',
	'pages.trangchu.subtitle': 'HỆ THỐNG PHẦN MỀM CHỈ ĐẠO, ĐIỀU HÀNH',
	'pages.gioithieu.title': 'GIỚI THIỆU',
	'pages.gioithieu.subtitle': 'HỆ THỐNG PHẦN MỀM CHỈ ĐẠO, ĐIỀU HÀNH',
};
