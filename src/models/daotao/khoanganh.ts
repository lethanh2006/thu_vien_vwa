import useInitModel from '@/hooks/useInitModel';
import type { KhoaNganh } from '@/services/DaoTao/KhoaNganh/typings';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<KhoaNganh.IRecord>('khoa-nganh', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
