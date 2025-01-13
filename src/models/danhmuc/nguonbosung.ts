import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<NguonBoSung.IRecord>('nguon-bo-sung');

	return {
		...objInit,
	};
};
