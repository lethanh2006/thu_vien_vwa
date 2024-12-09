import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { ETrangThaiMuonSach } from '@/services/SachTaiLieu/constant';
import type { MuonSach } from '@/services/SachTaiLieu/MuonSach/typing';
import { Modal } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const DanhSachQuaHan = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const { visible, setVisible } = props;
	const { getAllModel, loading } = useModel('sachtailieu.muontra.muontra');
	const [danhSach, setDanhSach] = useState<MuonSach.IRecord[]>([]);

	useEffect(() => {
		getAllModel(
			undefined,
			undefined,
			{ trangThai: ETrangThaiMuonSach.DANG_THUE_MUON },
			undefined,
			undefined,
			false,
		).then((res) => {
			const filtered = res.filter((item) => {
				const thoiGianMuon = moment(item?.thoiGianMuon);
				const hanTra = thoiGianMuon.add(item?.expired, 'days');
				return moment().isAfter(hanTra);
			});
			setDanhSach(filtered);
		});
	}, []);

	const columns: IColumn<MuonSach.IRecord>[] = [
		{
			title: 'Mã SV',
			dataIndex: 'maDinhDanhNguoiMuon',
			width: 120,
			filterType: 'string',
		},
		{
			title: 'Họ tên',
			dataIndex: 'hotenNguoiMuon',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'ĐKCB',
			dataIndex: 'soDangKyCaBiet',
			width: 90,
			filterType: 'string',
		},
		{
			title: 'Nhan đề',
			dataIndex: 'anPhamId',
			width: 180,
			render: (val, rec) => <ExpandText>{rec?.anPham?.nhanDe ?? 'Không có thông tin'}</ExpandText>,
		},
		{
			title: 'Thời gian mượn',
			dataIndex: 'thoiGianMuon',
			width: 150,
			render: (val, rec) =>
				val && <span style={{ color: 'red', fontWeight: 600 }}>{moment(val).format('HH:mm DD/MM/YYYY')}</span>,
			filterType: 'date',
			sortable: true,
		},
		{
			title: 'Hạn trả',
			align: 'center',
			dataIndex: 'expired',
			width: 120,
			render: (val, rec) => val && moment(rec?.thoiGianMuon).add(val, 'days').format('DD/MM/YYYY'),
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 220,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
	];

	return (
		<Modal
			title='Danh sách sinh viên quá hạn mượn sách'
			visible={visible}
			onCancel={() => setVisible(false)}
			width={800}
			footer={null}
			destroyOnClose
		>
			<TableStaticData
				loading={loading}
				columns={columns}
				data={danhSach ?? []}
				size='small'
				addStt
				hasTotal
				otherProps={{ pagination: true }}
			/>
		</Modal>
	);
};

export default DanhSachQuaHan;
