declare module LopHanhChinh {
	export interface IRecord {
		_id: string;
		ten: string;
		maKhoaSinhVien: string;
		khoaSinhVien?: KhoaSinhVien.IRecord;
		maNganh: string;
		nganh?: NganhDaoTao.IRecordCoSo;
		maKhoaNganh: string;
		khoaNganh?: KhoaNganh.IRecord;

		siSo: number;
		siSoToiDa: number;
		nhanSuSsoId?: string;
		// nhanSu?: ToChucNhanSu.INhanSu;
		// doiTuong?: EDoiTuongLopHanhChinh;
		createdAt?: string;
		updatedAt?: string;

		//Đợt nhập học
		// idDotNhapHoc: string;
		// dotNhapHoc: DotNhapHoc.IRecord;
	}

	export interface IRecordSinhVien {
		_id: string;
		lopHanhChinhId: string;
		lopHanhChinh?: IRecord;
		sinhVienSsoId: string;
		sinhVien?: SinhVien.IRecord;
	}

	export type TRequestPhanLop = {
		maKhoaNganh: string;
		soLopTaoThem?: number;
		siSoToiDa?: number;
	};

	export type TResponsePhanLop = {
		soSinhVienPhanLop: number;
		soLopMoThem: number;
	};

	export type TPhanLopHanhChinh = KhoaNganh.IRecord &
		TPhanLopHanhChinh & {
			//interface Phân lớp
			soLopHanhChinhDaMo?: number;
			soSinhVienDaPhanLop?: number;
			soChoConTrong?: number;

			soSinhVienChuaPhanLop?: number;
		};
}
