declare module NganhDaoTao {
	export interface IRecordBo {
		_id: string;
		ma: string;
		ten: string;
		createdAt?: string;
		updatedAt?: string;
	}

	export interface IRecordCoSo {
		_id: string;
		ma: string;
		ten: string;
		tenTiengAnh: string;
		dmNganhId?: string;
		dmNganh?: NganhDaoTao.IRecordBo;
		parentId?: string | null;
		parent?: IRecordCoSo;
		createdAt?: string;
		updatedAt?: string;
	}
}
