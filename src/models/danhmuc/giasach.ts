import useInitModel from '@/hooks/useInitModel';
import type { GiaSach } from '@/services/DanhMuc/GiaSach/typing';

export default () => {
	const objInit = useInitModel<GiaSach.IRecord>('gia-sach');

	return {
		...objInit,
	};
};
