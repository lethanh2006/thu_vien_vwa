import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<AnPham.IRecord>('an-pham');

	return {
		...objInit,
	};
};
