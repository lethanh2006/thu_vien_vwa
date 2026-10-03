import useInitModel from '@/hooks/useInitModel';
import { thanhLyDangKyCaBiet, thongKeDangKyCaBiet } from '@/services/SachTaiLieu/AnPham';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { xoaDangKyCaBiet, xoaNhieuDangKyCaBiet } from '@/services/SachTaiLieu/DangKyCaBiet';
import { message } from 'antd';
import { useRef, useState } from 'react';

export default () => {
	const objInit = useInitModel<AnPham.IAnPhamXepGia>('an-pham-xep-gia');
	const [loadingThongKe, setLoadingThongKe] = useState<boolean>(false);
	const [thongKeDKCB, setThongKeDKCB] = useState<AnPham.IThongKeAnPhamXepGia>();
	const [soDKCBRanh, setSoDKCBRanh] = useState<number>();
	const [soDKCBThanhLy, setSoDKCBThanhLy] = useState<number>();
	const { setFormSubmiting } = objInit;
	const modelRef = useRef(objInit);
	modelRef.current = objInit;
	const requestId = useRef(0);
	const foregroundRequest = useRef<Promise<AnPham.IAnPhamXepGia[]> | undefined>(undefined);
	const statRequestId = useRef(0);
	const statScope = useRef<string | undefined>(undefined);
	const foregroundStats = useRef(new Set<number>());
	const pendingLiquidations = useRef(new Set<string>());
	type GetArgs = Parameters<typeof objInit.getModel>;
	const makeQuery = (args: GetArgs, model = modelRef.current) => {
		const [
			paramCondition,
			filterParams,
			sortParam,
			paramPage,
			paramLimit,
			path,
			otherQuery,
			,
			absolute,
			select,
			config,
		] = args;
		return {
			payload: {
				page: paramPage || model.page,
				limit: paramLimit || model.limit,
				sort: sortParam || model.sort,
				condition: { ...model.condition, ...paramCondition },
				filters: [...(model.filters ?? []), ...(filterParams || [])]
					.filter((item) => item.active !== false)
					.map(({ active, ...item }) => item),
				select: select?.join(' '),
				...(otherQuery ?? {}),
			},
			path: path ?? 'page',
			absolute: absolute ?? false,
			headers: config?.dataPartitionCode ? { 'x-data-partition-code': config.dataPartitionCode } : undefined,
		};
	};
	type PageQuery = ReturnType<typeof makeQuery>;
	const latestQuery = useRef<PageQuery | undefined>(undefined);
	const latestArgs = useRef<GetArgs>([]);
	const pageSync = useRef<{ query: string; state: string; rows: AnPham.IAnPhamXepGia[] } | undefined>(undefined);
	const queryState = (model = modelRef.current, page = model.page) =>
		JSON.stringify({ page, limit: model.limit, condition: model.condition, filters: model.filters, sort: model.sort });

	const getModel = (...args: GetArgs): ReturnType<typeof objInit.getModel> => {
		const query = makeQuery(args);
		const sync = pageSync.current;
		pageSync.current = undefined;
		latestQuery.current = query;
		latestArgs.current = args;
		// Consume only the automatic request caused by the page correction below.
		if (sync && args[7] !== false && sync.query === JSON.stringify(query) && sync.state === queryState()) {
			return Promise.resolve(sync.rows);
		}
		requestId.current++;
		const request = modelRef.current.getModel(...args);
		foregroundRequest.current = request;
		void request
			.finally(() => {
				if (foregroundRequest.current === request) foregroundRequest.current = undefined;
			})
			.catch(() => undefined);
		return request;
	};

	const refreshModel = async (...args: GetArgs): ReturnType<typeof objInit.getModel> => {
		const model = modelRef.current;
		const effectiveArgs: GetArgs = args.length ? args : [...latestArgs.current];
		if (!args.length) {
			effectiveArgs[3] = undefined;
			effectiveArgs[4] = undefined;
		}
		const query = makeQuery(effectiveArgs, model);
		const state = queryState(model);
		const previousQuery = JSON.stringify(latestQuery.current);
		const id = ++requestId.current;
		const isCurrent = () =>
			id === requestId.current && state === queryState() && previousQuery === JSON.stringify(latestQuery.current);
		// A request started before the mutation must finish before fresh rows are applied.
		await foregroundRequest.current?.catch(() => undefined);
		if (!isCurrent()) return modelRef.current.danhSach;
		const load = () => modelRef.current.getService(query.payload, query.path, query.absolute, query.headers);
		let response = await load();
		if (!isCurrent()) return modelRef.current.danhSach;
		let rows: AnPham.IAnPhamXepGia[] = response?.data?.data?.result ?? [];
		let total: number = response?.data?.data?.total ?? 0;
		let correctedPage = false;
		while (query.path === 'page' && !rows.length && effectiveArgs[7] !== false) {
			const maxPage = Math.ceil(total / query.payload.limit) || 1;
			if (query.payload.page <= maxPage) break;
			query.payload.page = maxPage;
			correctedPage = true;
			if (!total) break;
			response = await load();
			if (!isCurrent()) return modelRef.current.danhSach;
			rows = response?.data?.data?.result ?? [];
			total = response?.data?.data?.total ?? 0;
		}
		if (effectiveArgs[7] !== false) modelRef.current.setDanhSach(rows);
		modelRef.current.setTotal(total);
		if (correctedPage && query.payload.page !== modelRef.current.page) {
			pageSync.current = {
				query: JSON.stringify(query),
				state: queryState(modelRef.current, query.payload.page),
				rows,
			};
			modelRef.current.setPage(query.payload.page);
		}
		return rows;
	};

	const setPage: typeof objInit.setPage = (value) => {
		pageSync.current = undefined;
		return modelRef.current.setPage(value);
	};

	const xoaDangKyCaBietModel = async (idOrIds: string | string[]): Promise<any> => {
		const res = await (Array.isArray(idOrIds) ? xoaNhieuDangKyCaBiet(idOrIds) : xoaDangKyCaBiet(idOrIds));
		return res.data?.data;
	};

	const thongKeDangKyCaBietModel = async (
		condition?: any,
		filters?: any[],
		options?: { background?: boolean },
	): Promise<AnPham.IThongKeAnPhamXepGia> => {
		const id = ++statRequestId.current;
		const scope = JSON.stringify({ condition, filters });
		if (statScope.current !== scope) {
			statScope.current = scope;
			setThongKeDKCB(undefined);
			setSoDKCBRanh(undefined);
			setSoDKCBThanhLy(undefined);
		}
		const isCurrent = () =>
			id === statRequestId.current &&
			statScope.current === scope &&
			(!options?.background ||
				!latestQuery.current ||
				latestQuery.current.payload.condition.anPhamId === condition?.anPhamId);
		if (!options?.background) {
			foregroundStats.current.add(id);
			setLoadingThongKe(true);
		}
		try {
			const aggregate = Promise.resolve()
				.then(() => thongKeDangKyCaBiet({ condition, filters }))
				.then((res): AnPham.IThongKeAnPhamXepGia => res.data?.data);
			const countStatus = (trangThai: string) =>
				Promise.resolve()
					.then(() => {
						const query = { page: 1, limit: 1, condition: { ...condition, trangThai }, filters };
						return modelRef.current.getService(query, 'page');
					})
					.then((res) => {
						const total: unknown = res.data?.data?.total;
						if (typeof total !== 'number' || !Number.isFinite(total) || total < 0) {
							throw new Error('Không tải được số lượng đăng ký cá biệt theo trạng thái.');
						}
						return total;
					});
			// Total includes liquidated copies, so availability must come from the status query.
			const results = await Promise.allSettled([aggregate, countStatus('Rảnh'), countStatus('Đã Thanh lý')] as const);
			if (isCurrent()) {
				setThongKeDKCB(results[0].status === 'fulfilled' ? results[0].value : undefined);
				setSoDKCBRanh(results[1].status === 'fulfilled' ? results[1].value : undefined);
				setSoDKCBThanhLy(results[2].status === 'fulfilled' ? results[2].value : undefined);
			}
			for (const result of results) {
				if (result.status === 'rejected') throw result.reason;
			}
			return (results[0] as PromiseFulfilledResult<AnPham.IThongKeAnPhamXepGia>).value;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			if (!options?.background) {
				foregroundStats.current.delete(id);
				setLoadingThongKe(foregroundStats.current.size > 0);
			}
		}
	};

	const thanhLyDangKyCaBietModel = async (
		payLoad: {
			_id: string;
			thanhLy: boolean;
		},
		getData?: () => void,
	): Promise<any> => {
		if (pendingLiquidations.current.has(payLoad._id)) return Promise.reject('form submiting');
		pendingLiquidations.current.add(payLoad._id);
		setFormSubmiting(true);

		try {
			const res = await thanhLyDangKyCaBiet(payLoad);
			message.success('Lưu thành công');

			if (getData) getData();

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			pendingLiquidations.current.delete(payLoad._id);
			setFormSubmiting(pendingLiquidations.current.size > 0);
		}
	};

	return {
		...objInit,
		getModel,
		refreshModel,
		setPage,
		loadingThongKe,
		thongKeDKCB,
		soDKCBRanh,
		soDKCBThanhLy,
		thongKeDangKyCaBietModel,
		thanhLyDangKyCaBietModel,
		xoaDangKyCaBietModel,
	};
};
