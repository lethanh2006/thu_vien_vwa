import useInitModel from '@/hooks/useInitModel';
import type { MauBienMuc } from '@/services/DanhMuc/MauBienMuc/typing';

export default () => {
	const objInit = useInitModel<MauBienMuc.IRecord>('mau-bien-muc');

	return {
		...objInit,
	};
};
