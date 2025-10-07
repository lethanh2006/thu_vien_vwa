import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<VatMangTin.IRecord>('vat-mang-tin');

	return {
		...objInit,
	};
};
