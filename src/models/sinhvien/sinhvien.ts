import { EOperatorType } from '@/components/Table/constant';
import type { TFilter } from '@/components/Table/typing';
import useInitModel from '@/hooks/useInitModel';
import { getThongTinSinhVienBySsoId } from '@/services/SinhVien';
import type { ETrangThaiHocSv } from '@/services/SinhVien/constant';
import { type SinhVien } from '@/services/SinhVien/typings';
import { ipDaoTao } from '@/utils/ip';
import type { AxiosResponse } from 'axios';
import _ from 'lodash';

export default () => {
	const objInit = useInitModel<SinhVien.IRecord>('sinh-vien', undefined, undefined, ipDaoTao);

	const { setRecord, setLoading, getService, setDanhSach } = objInit;

	const getThongTinSinhVienBySsoIdModel = async (ssoId: string): Promise<SinhVien.IRecord | undefined> => {
		if (!ssoId) return;
		setLoading(true);
		try {
			const response = await getThongTinSinhVienBySsoId(ssoId);
			setRecord(response?.data?.data ?? null);
			return response?.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const searchSinhVienModel = async (
		keyword: string,
		trangThaiHoc?: ETrangThaiHocSv[],
		isSetDanhSach?: boolean,
		condition?: Partial<SinhVien.IRecord>,
	): Promise<SinhVien.IRecord[]> => {
		setLoading(true);
		try {
			const filterStatus: TFilter<SinhVien.IRecord> = {
				active: true,
				field: 'trangThaiHoc',
				operator: EOperatorType.INCLUDE,
				values: trangThaiHoc ?? [],
			};
			const payloads = [
				{
					page: 1,
					limit: 20,
					condition,
					filters: [
						{ active: true, field: 'ma', values: [keyword], operator: EOperatorType.CONTAIN },
						...(trangThaiHoc ? [filterStatus] : []),
					],
				},
				{
					page: 1,
					limit: 20,
					condition,
					filters: [
						{ active: true, field: 'ten', values: [keyword], operator: EOperatorType.CONTAIN },
						...(trangThaiHoc ? [filterStatus] : []),
					],
				},
			];
			const responses = await Promise.allSettled(payloads.map((payload) => getService(payload, 'page')));
			const data = (
				responses.filter((item) => item.status === 'fulfilled') as PromiseFulfilledResult<AxiosResponse<any>>[]
			).map((item) => item.value.data?.data?.result);
			const flatData: SinhVien.IRecord[] = data.flat();
			const uniqData = _.uniqBy(flatData, (item) => item.ssoId);
			if (isSetDanhSach !== false) setDanhSach(uniqData);

			return uniqData;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const updateFaceRegModel = (sinhVienSsoId: string, data: { faceRegImgUrl: string }, getData?: () => void) =>
		putModel(`${sinhVienSsoId}/admin/face-reg`, data, getData);

	return {
		...objInit,
		getThongTinSinhVienBySsoIdModel,
		searchSinhVienModel,
		updateFaceRegModel,
	};
};
