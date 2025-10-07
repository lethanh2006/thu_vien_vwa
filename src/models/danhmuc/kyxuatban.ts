import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<KyXuatBan.IRecord>('ky-xuat-ban');

	return {
		...objInit,
	};
};
