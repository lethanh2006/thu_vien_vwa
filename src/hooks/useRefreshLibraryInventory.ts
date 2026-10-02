import { useModel } from 'umi';

const useRefreshLibraryInventory = (onChanged?: () => unknown) => {
	const { thongKeXepGiaModel } = useModel('sachtailieu.anpham.xepgia');
	const { thongKeDangKyCaBietModel } = useModel('sachtailieu.anpham.anphamxepgia');
	const { getAllModel: getAllKhoSach } = useModel('danhmuc.khosach');

	return (anPhamId?: string) => {
		const condition = anPhamId ? { anPhamId } : undefined;
		return Promise.allSettled([
			Promise.resolve().then(() => thongKeXepGiaModel(condition)),
			Promise.resolve().then(() => thongKeDangKyCaBietModel(condition)),
			Promise.resolve().then(() => getAllKhoSach()),
			Promise.resolve().then(() => onChanged?.()),
		]);
	};
};

export default useRefreshLibraryInventory;
