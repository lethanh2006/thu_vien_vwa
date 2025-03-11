import useInitModel from '@/hooks/useInitModel';
import type { MauDinhDang } from '@/services/DanhMuc/MauDinhDang/typing';

export default () => {
	const objInit = useInitModel<MauDinhDang.IRecord>('mau-in-ma-vach');

	return {
		...objInit,
	};
};
