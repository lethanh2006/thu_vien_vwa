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

	//QUẢN LÝ THƯ VIỆN
	{
		name: 'QuanLyThuVien',
		path: 'quan-ly-thu-vien',
		icon: 'container',
		routes: [
			{
				name: 'BaoCaoThuVien',
				path: 'bao-cao-thu-vien',
				routes: [
					{
						name: 'ThuVien',
						path: 'thu-vien',
						component: './QuanLyThuVien/BaoCao/ThongKeThuVien.tsx',
					},
					{
						name: 'LuanAnLuanVanKhoaLuan',
						path: 'luan-an-luan-van-khoa-luan',
						component: './QuanLyThuVien/BaoCao/LuanAnLuanVan.tsx',
					},
				],
			},
			{
				name: 'VaoRaThuVien',
				path: 'vao-ra-thu-vien',
				component: './QuanLyThuVien/VaoRaThuVien',
			},
			{
				name: 'QuanLyDot',
				path: 'quan-ly-dot',
				component: 'QuanLyThuVien/QuanLyDot',
			},
			{
				name: 'QuanLyLuanAn',
				path: 'quan-ly-luan-an',
				component: 'QuanLyThuVien/QuanLyLuanAn',
			},
			{
				name: 'QuanLyLuanVan',
				path: 'quan-ly-luan-van',
				component: 'QuanLyThuVien/QuanLyLuanVan',
			},
			{
				name: 'QuanLyKhoaLuan',
				path: 'quan-ly-khoa-luan',
				component: 'QuanLyThuVien/QuanLyKhoaLuan',
			},
		],
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

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
		component: './exception/404',
	},
];
