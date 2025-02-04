import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { MuonSach } from '@/services/SachTaiLieu/MuonSach/typing';
import { Tag } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import ChiTietLichSu from './ChiTiet';
import {
	colorTrangThaiDuyeMuonSach,
	colorTrangThaiMuonSach,
	ETrangThaiDuyeMuonSach,
	ETrangThaiMuonSach,
} from '@/services/SachTaiLieu/constant';

const LichSuThueMuonPage = (props: { condition: Partial<MuonSach.IRecord> }) => {
	const { condition } = props;
	const { getModel, page, limit, handleView } = useModel('sachtailieu.muontra.muontra');

	const getData = () => {
		if (condition) getModel(condition);
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
			title: 'Nhan đề',
			width: 220,
			render: (val, rec) => <ExpandText>{rec?.anPham?.nhanDe}</ExpandText>,
			onCell,
		},
		{
			title: 'Tác giả',
			width: 180,
			render: (val, rec) => rec?.anPham?.tacGia,
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
			render: (val, rec) => {
				if (!val) return null;

				const formattedTime = moment(val).startOf('day').format('DD/MM/YYYY');

				const expirationTime = rec?.expired ? moment(rec.expired).startOf('day') : moment().startOf('day');
				const now = moment().startOf('day');

				const isOverdue = now.isAfter(expirationTime);
				const isApproachingDeadline = !isOverdue && expirationTime.diff(now, 'days') <= 7;

				const color = isOverdue ? 'red' : isApproachingDeadline ? 'orange' : 'inherit';
				const fontWeight = isOverdue || isApproachingDeadline ? 600 : 'normal';

				return <span style={{ color, fontWeight }}>{formattedTime}</span>;
			},
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: 'Thời gian dự kiến mượn',
			dataIndex: 'thoiGianMuonDuKien',
			width: 130,
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: 'Thời gian dự kiến trả',
			dataIndex: 'thoiGianTraDuKien',
			width: 130,
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: 'Hạn trả',
			align: 'center',
			dataIndex: 'expired',
			width: 130,
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
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
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: 'Thời gian trả',
			dataIndex: 'thoiGianTra',
			width: 150,
			render: (val, rec) => {
				if (!val) return null;

				const formattedTime = moment(val).startOf('day').format('DD/MM/YYYY');

				const expirationTime = rec?.expired ? moment(rec.expired).startOf('day') : moment().startOf('day');
				const isOverdue = moment().startOf('day').isAfter(expirationTime);

				return (
					<span style={{ color: isOverdue ? 'red' : 'inherit', fontWeight: isOverdue ? 600 : 0 }}>{formattedTime}</span>
				);
			},
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
			dependencies={[page, limit, JSON.stringify(condition)]}
			modelName='sachtailieu.muontra.muontra'
			Form={ChiTietLichSu}
			widthDrawer={800}
			hideCard
			buttons={{ create: false }}
		/>
	);
};

export default LichSuThueMuonPage;
