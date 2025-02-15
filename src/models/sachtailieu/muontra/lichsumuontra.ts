import useInitModel from '@/hooks/useInitModel';
import type { MuonSach } from '@/services/SachTaiLieu/MuonSach/typing';

export default () => {
	const objInit = useInitModel<MuonSach.IRecord>('thue-muon-an-pham');

	return {
		...objInit,
	};
};
