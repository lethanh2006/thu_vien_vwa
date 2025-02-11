declare module KhoSach {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		maPhongDoc: string;
		phongDoc: PhongDoc.IRecord;
		createdAt?: string;
		updatedAt?: string;
	}
}
