import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<TruongCon.IRecord>('tag-code');

	return {
		...objInit,
	};
};
