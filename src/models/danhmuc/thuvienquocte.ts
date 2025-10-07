import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<Z3950.IMayChu>('thu-vien-quoc-te');

	return {
		...objInit,
	};
};
