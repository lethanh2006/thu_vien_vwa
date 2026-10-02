import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';

type Options = {
	anPhamId?: string;
	scope?: string;
	getData: () => unknown;
	onChanged?: () => unknown;
};

export type DKCBActionError = { message: string; hasBorrowingHistory: boolean };

export default function useDKCBActions({ anPhamId, scope, getData, onChanged }: Options) {
	const { selectedIds, setSelectedIds, xoaDangKyCaBietModel, thanhLyDangKyCaBietModel, thongKeDangKyCaBietModel } =
		useModel('sachtailieu.anpham.anphamxepgia');
	const { getModel: getXepGia, thongKeXepGiaModel } = useModel('sachtailieu.anpham.xepgia');
	const { getAllModel: getKhoSach } = useModel('danhmuc.khosach');
	const [busy, setBusy] = useState(false);
	const [actionError, setActionError] = useState<DKCBActionError>();
	const pending = useRef(false);

	useEffect(() => {
		setSelectedIds(undefined);
		setActionError(undefined);
	}, [anPhamId, scope]);

	const refresh = async () => {
		const condition = anPhamId ? { anPhamId } : undefined;
		const results = await Promise.allSettled([
			Promise.resolve().then(getData),
			thongKeDangKyCaBietModel(condition),
			getXepGia(condition),
			thongKeXepGiaModel(condition),
			getKhoSach(),
			Promise.resolve().then(() => onChanged?.()),
		]);
		if (results.some((result) => result.status === 'rejected')) {
			message.warning('Thao tác đã thành công. Một số dữ liệu chưa tải lại được; hãy bấm Tải lại.');
		}
	};

	const handleError = (error: any) => {
		const body = error?.response?.data;
		const code = body?.code ?? body?.errorCode ?? body?.detail?.errorCode;
		setActionError({
			message: body?.message ?? body?.detail?.message ?? 'Thao tác chưa thực hiện được. Vui lòng thử lại.',
			hasBorrowingHistory: code === 'error-dkcb-da-co-lich-su-muon',
		});
	};

	const remove = async (idOrIds: string | string[]) => {
		if (pending.current || (Array.isArray(idOrIds) && idOrIds.length === 0)) return;
		pending.current = true;
		setBusy(true);
		setActionError(undefined);
		try {
			await xoaDangKyCaBietModel(idOrIds);
			const deletedIds = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
			setSelectedIds((ids) => ids?.filter((id) => !deletedIds.includes(id)));
			message.success(`Đã xóa ${deletedIds.length} số đăng ký cá biệt`);
			await refresh();
		} catch (error) {
			handleError(error);
		} finally {
			pending.current = false;
			setBusy(false);
		}
	};

	const liquidate = async (record: AnPham.IAnPhamXepGia) => {
		if (pending.current) return;
		pending.current = true;
		setBusy(true);
		setActionError(undefined);
		try {
			await thanhLyDangKyCaBietModel({ _id: record._id, thanhLy: true });
			await refresh();
		} catch (error) {
			handleError(error);
		} finally {
			pending.current = false;
			setBusy(false);
		}
	};

	return { busy, actionError, selectedIds, remove, liquidate, refresh };
}
