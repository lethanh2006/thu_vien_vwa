import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<PhongDoc.IRecord>('phong-doc');

	return {
		...objInit,
	};
};
