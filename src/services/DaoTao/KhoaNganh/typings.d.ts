import type { ChuongTrinhDaoTao } from '@/services/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import type { NganhDaoTao } from '@/services/DanhMucHeThong/Nganh/typings';
import type { KhoaSinhVien } from '../KhoaSinhVien/typings';

declare module KhoaNganh {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		maChuongTrinhDaoTao: string;
		chuongTrinh?: ChuongTrinhDaoTao.IRecord;
		maKhoaSinhVien: string;
		khoaSinhVien: KhoaSinhVien.IRecord;
		maNganh: string;
		nganh: NganhDaoTao.IRecordCoSo;
		namBatDau?: number;
		namKetThuc?: number;

		maCSDT: string;
		csdt?: CoSoDaoTao.IRecord;
		maTinhChatCt: string;
		tinhChatCt?: TinhChatChuongTrinh.IRecord;

		createdAt?: string;
		updatedAt?: string;

		// Fake query
		maTrinhDo?: string;
		maHinhThuc?: string;
	}

	export type TKhoaNganhSv = {
		khoaNganhChinh: IRecord;
		khoaNganhPhu?: IRecord;
	};

	export type TCondition = Partial<Pick<IRecord, 'maCSDT' | 'maHinhThuc' | 'maTrinhDo'>>;
}
