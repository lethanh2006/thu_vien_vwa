export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},

	{
		name: 'VaoRaThuVien',
		path: 'vao-ra-thu-vien',
		icon: 'SolutionOutlined',
		routes: [
			{
				name: 'DanhSachSinhVien',
				path: 'danh-sach-sinh-vien',
				component: './VaoRaThuVien/DanhSachSinhVien',
			},
			{
				name: 'TongHop',
				path: 'tong-hop',
				component: './VaoRaThuVien/BaoCao/ThongKeThuVien.tsx',
			},
		],
	},

	{
		name: 'LALVKhoaLuan',
		path: 'la-lv-kl-sinh-vien',
		icon: 'container',
		routes: [
			{
				name: 'QuanLyDot',
				path: 'quan-ly-dot',
				component: './LALVKhoaLuan/QuanLyDot',
			},
			{
				name: 'DanhSachSinhVien',
				path: 'danh-sach-sinh-vien',
				component: './LALVKhoaLuan/DanhSachSinhVien',
			},
		],
	},

	//SACH TAI LIEU
	{
		name: 'SachTaiLieu',
		path: 'sach-tai-lieu',
		icon: 'BookOutlined',
		routes: [
			{
				name: 'BienMuc',
				path: 'bien-muc',
				component: './SachTaiLieu/BienMuc',
			},
			{
				name: 'AnPham',
				path: 'an-pham',
				component: './SachTaiLieu/AnPham',
			},
			{
				name: 'MuonTraSach',
				path: 'muon-tra-sach',
				component: './SachTaiLieu/MuonTraSach',
			},
			{
				name: 'ThongKeBanDoc',
				path: 'thong-ke-ban-doc',
				component: './SachTaiLieu/ThongKeBanDoc',
			},
		],
	},

	// DANH MUC HE THONG
	{
		name: 'DanhMuc',
		path: '/danh-muc',
		icon: 'copy',
		routes: [
			// {
			// 	name: 'ChucVu',
			// 	path: 'chuc-vu',
			// 	component: './DanhMuc/ChucVu',
			// },
			{
				name: 'MauBienMuc',
				path: 'mau-bien-muc',
				component: './DanhMuc/MauBienMuc',
			},
			{
				name: 'ThuVien',
				path: 'thu-vien',
				component: './DanhMuc/ThuVien',
			},
			{
				name: 'DangTaiLieu',
				path: 'dang-tai-lieu',
				component: './DanhMuc/DangTaiLieu',
			},
			{
				name: 'KieuBanGhi',
				path: 'kieu-ban-ghi',
				component: './DanhMuc/KieuBanGhi',
			},
			{
				name: 'CapThuMuc',
				path: 'cap-thu-muc',
				component: './DanhMuc/CapThuMuc',
			},
			{
				name: 'VatMangTin',
				path: 'vat-mang-tin',
				component: './DanhMuc/VatMangTin',
			},
			{
				name: 'KhoSach',
				path: 'kho-sach',
				component: './DanhMuc/KhoSach',
			},
			{
				name: 'TruongBienMuc',
				path: 'truong-bien-muc',
				component: './DanhMuc/TruongBienMuc',
			},
		],
	},

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
