import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import {
	colorTrangThaiDuyeMuonSach,
	colorTrangThaiMuonSach,
	ETrangThaiDuyeMuonSach,
	ETrangThaiMuonSach,
} from '@/services/SachTaiLieu/constant';
import type { MuonSach } from '@/services/SachTaiLieu/MuonSach/typing';
import { Tag } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import ChiTietLichSu from './ChiTiet';

const DanhSachBanDoc = () => {
	const { record: recSinhVien } = useModel('sachtailieu.muontra.danhsachbandoc');
	const { getModel, page, limit, handleView } = useModel('sachtailieu.muontra.muontra');

	const getData = () => {
		if (recSinhVien?._id) getModel({ ssoIdNguoiMuon: recSinhVien?.ssoId });
	};

	const onCell = (rec: MuonSach.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<MuonSach.IRecord>[] = [
		{
			title: 'Mã SV',
			dataIndex: 'maDinhDanhNguoiMuon',
			align: 'center',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Họ tên',
			dataIndex: 'hotenNguoiMuon',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'ĐKCB',
			dataIndex: 'soDangKyCaBiet',
			width: 90,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Thời gian mượn',
			dataIndex: 'thoiGianMuon',
			align: 'center',
			width: 150,
			render: (val, rec) => val && moment(val).format('HH:mm DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
		},

		{
			title: 'Hạn trả',
			align: 'center',
			dataIndex: 'expired',
			width: 130,
			render: (val, rec) => val && moment(val).format('HH:mm DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: 'Trạng thái',
			align: 'center',
			dataIndex: 'daLaySach',
			width: 120,
			render: (val, rec) => (val ? <Tag color='green'>Đã lấy</Tag> : <Tag color='red'>Chưa lấy</Tag>),
			onCell,
		},
		{
			title: 'Thời gian gia hạn',
			align: 'center',
			dataIndex: 'thoiGianGiaHan',
			width: 130,
			render: (val, rec) => val && moment(val).format('HH:mm DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: 'Thời gian trả',
			dataIndex: 'thoiGianTra',
			width: 150,
			render: (val, rec) => val && moment(val).format('HH:mm DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: 'Ghi chú đăng ký',
			dataIndex: 'ghiChuDangKy',
			width: 220,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 220,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		{
			title: 'Ghi chú trả',
			dataIndex: 'ghiChuTra',
			width: 220,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		{
			title: 'Trạng thái duyệt',
			dataIndex: 'trangThaiDuyet',
			align: 'center',
			width: 120,
			render: (val, rec) => <Tag color={colorTrangThaiDuyeMuonSach[val as ETrangThaiDuyeMuonSach]}>{val}</Tag>,
			filterType: 'select',
			filterData: Object.values(ETrangThaiDuyeMuonSach),
			fixed: 'right',
			onCell,
		},
		{
			title: 'Trạng thái đơn',
			dataIndex: 'trangThai',
			align: 'center',
			width: 130,
			render: (val, rec) => <Tag color={colorTrangThaiMuonSach[val as ETrangThaiMuonSach]}>{val}</Tag>,
			filterType: 'select',
			filterData: Object.values(ETrangThaiMuonSach),
			fixed: 'right',
			onCell,
		},
	];

	return (
		<TableBase
			getData={getData}
			columns={columns}
			dependencies={[page, limit, recSinhVien?._id]}
			modelName='sachtailieu.muontra.muontra'
			Form={ChiTietLichSu}
			widthDrawer={800}
			title={`Danh sách lịch sử mượn trả sách sinh viên ${recSinhVien?.ten}`}
			buttons={{ create: false }}
		/>
	);
};

export default DanhSachBanDoc;
