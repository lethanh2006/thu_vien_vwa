import useInitModel from '@/hooks/useInitModel';
import type { SinhVien } from '@/services/SinhVien/typings';
import type { ToChucNhanSu } from '@/services/ToChucNhanSu/typing';

export default () => {
	const objInit = useInitModel<SinhVien.IRecord & ToChucNhanSu.INhanSu>('thue-muon-an-pham');

	return {
		...objInit,
	};
};
