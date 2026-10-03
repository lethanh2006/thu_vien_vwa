import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';

type Options = {
	anPhamId?: string;
	scope?: string;
	getData: (options?: DKCBRefreshOptions) => unknown;
	onChanged?: () => unknown;
};

export type DKCBActionError = { message: string; hasBorrowingHistory: boolean };
export type DKCBRefreshOptions = { background?: boolean };
export type DKCBPendingAction = { type: 'delete' | 'liquidate'; ids: string[]; batch: boolean };

export default function useDKCBActions({ anPhamId, scope, getData, onChanged }: Options) {
	const { selectedIds, setSelectedIds, xoaDangKyCaBietModel, thanhLyDangKyCaBietModel, thongKeDangKyCaBietModel } =
		useModel('sachtailieu.anpham.anphamxepgia');
	const { getModel: getXepGia, thongKeXepGiaModel } = useModel('sachtailieu.anpham.xepgia');
	const { getAllModel: getKhoSach } = useModel('danhmuc.khosach');
	const [busy, setBusy] = useState(false);
	const [actionError, setActionError] = useState<DKCBActionError>();
	const [activeActions, setActiveActions] = useState<DKCBPendingAction[]>([]);
	const pending = useRef(new Set<string>());
	const currentOptions = useRef({ anPhamId, getData, onChanged });
	currentOptions.current = { anPhamId, getData, onChanged };
	const mounted = useRef(true);

	useEffect(() => {
		mounted.current = true;
		return () => {
			mounted.current = false;
		};
	}, []);

	useEffect(() => {
		setSelectedIds(undefined);
		setActionError(undefined);
	}, [anPhamId, scope]);

	const refresh = async () => {
		if (!mounted.current) return;
		const current = currentOptions.current;
		const condition = current.anPhamId ? { anPhamId: current.anPhamId } : undefined;
		const results = await Promise.allSettled([
			Promise.resolve().then(() => current.getData({ background: true })),
			Promise.resolve().then(() => thongKeDangKyCaBietModel(condition, undefined, { background: true })),
			...(current.anPhamId
				? [
						Promise.resolve().then(() => getXepGia(condition)),
						Promise.resolve().then(() => thongKeXepGiaModel(condition)),
						Promise.resolve().then(() => getKhoSach()),
					]
				: []),
			Promise.resolve().then(() => current.onChanged?.()),
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

	const beginAction = (action: DKCBPendingAction) => {
		if (!action.ids.length || action.ids.some((id) => pending.current.has(id))) return false;
		action.ids.forEach((id) => pending.current.add(id));
		setBusy(true);
		setActionError(undefined);
		setActiveActions((current) => [...current, action]);
		return true;
	};

	const finishAction = (action: DKCBPendingAction) => {
		action.ids.forEach((id) => pending.current.delete(id));
		if (mounted.current) {
			setBusy(pending.current.size > 0);
			setActiveActions((current) => current.filter((item) => item !== action));
		}
	};

	const remove = async (idOrIds: string | string[]) => {
		const deletedIds = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
		const action: DKCBPendingAction = { type: 'delete', ids: deletedIds, batch: Array.isArray(idOrIds) };
		if (!beginAction(action)) return;
		try {
			await xoaDangKyCaBietModel(idOrIds);
			message.success(`Đã xóa ${deletedIds.length} số đăng ký cá biệt`);
			if (!mounted.current) return;
			setSelectedIds((ids) => ids?.filter((id) => !deletedIds.includes(id)));
			await refresh();
		} catch (error) {
			if (mounted.current) handleError(error);
		} finally {
			finishAction(action);
		}
	};

	const liquidate = async (record: AnPham.IAnPhamXepGia) => {
		const action: DKCBPendingAction = { type: 'liquidate', ids: [record._id], batch: false };
		if (!beginAction(action)) return;
		try {
			await thanhLyDangKyCaBietModel({ _id: record._id, thanhLy: true });
			await refresh();
		} catch (error) {
			if (mounted.current) handleError(error);
		} finally {
			finishAction(action);
		}
	};

	return {
		busy,
		activeAction: activeActions[0],
		activeActions,
		pendingIds: activeActions.flatMap((action) => action.ids),
		actionError,
		selectedIds,
		remove,
		liquidate,
		refresh,
	};
}
