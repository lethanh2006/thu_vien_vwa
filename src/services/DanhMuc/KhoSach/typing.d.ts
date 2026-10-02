declare module KhoSach {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		maPhongDoc: string;
		phongDoc: PhongDoc.IRecord;
		soLuongAnPhamDaXepGia: number;
		dkcbLastSeq?: number;
		createdAt?: string;
		updatedAt?: string;
	}
}
