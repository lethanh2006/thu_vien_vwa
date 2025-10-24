import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<LopHanhChinh.IRecord>('lop-hanh-chinh', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
