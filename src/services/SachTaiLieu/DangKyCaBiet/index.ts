import { EOperatorType } from '@/components/Table/constant';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export type ManualDKCBPayload = {
	anPhamId: string;
	soDangKyCaBiet: string;
	thongTinXepGiaId?: string;
};

export const xoaDangKyCaBiet = (id: string) => axios.delete(`${ip3}/an-pham-xep-gia/${id}`, { data: { silent: true } });

export const xoaNhieuDangKyCaBiet = (ids: string[]) =>
	axios.delete(`${ip3}/an-pham-xep-gia/many/ids`, { data: { ids, silent: true } });

export const themDangKyCaBiet = (payload: ManualDKCBPayload) => axios.post(`${ip3}/an-pham-xep-gia`, payload);

export const getKhoSachForDKCB = () => axios.get(`${ip3}/kho-sach/many`);

export const getAnPhamForDKCB = (keyword: string) =>
	axios.get(`${ip3}/an-pham/page`, {
		params: {
			page: 1,
			limit: 20,
			condition: { online: false },
			filters: keyword ? [{ field: 'nhanDe', values: [keyword], operator: EOperatorType.CONTAIN }] : [],
		},
	});

export const getXepGiaForDKCB = (anPhamId: string, maKhoSach: string) =>
	axios.get(`${ip3}/xep-gia/many`, { params: { condition: { anPhamId, maKhoSach, daXepGia: true } } });
