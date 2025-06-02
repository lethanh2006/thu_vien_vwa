import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<HocPhan.IRecord>('hoc-phan', undefined, { active: true }, ipDaoTao);

	return {
		...objInit,
	};
};
