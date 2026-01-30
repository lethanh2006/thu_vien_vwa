declare module DonViSo {
	export interface IRecord {
		id: string;
		ten: string;
		parentId: string;
		vanBanGioiThieu: string;
		moTaNgan: string;
		tinTuc: string;
		thongTinBanQuyen: string;
		urlAnhDaiDien: string;

		type: string; //'community' || collection;
		uuid: string;
		name: string;
		handle: string;
	}
}
