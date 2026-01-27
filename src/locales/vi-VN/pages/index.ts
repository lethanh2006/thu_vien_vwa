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
};
