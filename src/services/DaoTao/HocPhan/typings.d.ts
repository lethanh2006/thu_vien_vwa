declare module HocPhan {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		tenTiengAnh?: string;
		maLoaiHocPhan: string;
		loaiHocPhan?: ILoaiHocPhan;
		soTinChi: number;
		maTrinhDoDaoTao: string;
		trinhDoDaoTao?: TrinhDoDaoTao.IRecordCoSo;
		maDonVi: string;
		donVi?: ToChucNhanSu.IDonVi;
		active: boolean;
		deCuongHienTaiId?: string;
		deCuongHienTai?: IDeCuongHocPhan;

		loaiHocPhi?: ELoaiHocPhiHocPhan;

		// Phục vụ xếp thời khóa biểu
		coXepThoiKhoaBieu: boolean;
		loaiPhong?: ELoaiPhongHoc;
		// loaiPhongThucHanh?: ELoaiPhongHoc;
		siSoToiThieu?: number;
		siSoToiDa?: number;
		soTietTrongTuan?: number;
		soTietTichLuy?: number;

		createdAt?: string;
		updatedAt?: string;
	}
}
